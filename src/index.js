const config=require("./config");
const {banner,log,error}=require("./lib/logger");
const {startMonitor,stopMonitor}=require("./lib/monitor");
const {stopAll}=require("./lib/scheduler");
const database=require("./lib/database");
const {connectWhatsApp,shutdown}=require("./connection/whatsapp");
const RuntimeGuard=require("./lib/runtime-guard");
const RuntimeSafety=require("./lib/runtime-safety");
const HealthServer=require("./lib/health-server");
const {loadPlugins}=require("./lib/plugin-loader");
let stopping=false;
let dbHealthTimer=null, runtimeTimer=null;
let runtimeGuard, runtimeSafety, healthServer;

async function start(){
  config.loadConfig();
  banner(config);
  loadPlugins();

  runtimeGuard=new RuntimeGuard({config,state:require("./lib/state"),logger:{warn,error,log}});
  runtimeSafety=new RuntimeSafety({state:require("./lib/state"),logger:{warn,error,log}});
  healthServer=new HealthServer({logger:{log,warn,error},status:()=>({state:require("./lib/state").getState(),runtime:runtimeGuard.snapshot(),safety:runtimeSafety.snapshot(),database:database.type()})});
  healthServer.start();
  runtimeTimer=setInterval(()=>runtimeGuard.sample(),15000); runtimeTimer.unref?.();
  await database.init(config);
  log(`Database initialized: ${database.type()} (schema ${database.version()})`);

  const initialHealth=await database.healthCheck();
  if(!initialHealth.ok) throw new Error(`Database health check failed: ${initialHealth.error}`);
  log(`Database health: OK (${initialHealth.latencyMs}ms)`);

  const interval=Number(config.database.healthCheckIntervalMs||0);
  if(interval>0){
    dbHealthTimer=setInterval(async()=>{
      const result=await database.healthCheck();
      if(result.ok) log(`Database health: OK (${result.latencyMs}ms)`);
      else error(`Database health: FAILED - ${result.error}`);
    },interval);
    dbHealthTimer.unref?.();
  }

  process.on("uncaughtException",e=>error("Uncaught exception:",e));
  process.on("unhandledRejection",e=>error("Unhandled rejection:",e));

  const stop=async s=>{
    if(stopping)return;
    stopping=true;
    if(dbHealthTimer)clearInterval(dbHealthTimer);
    if(runtimeTimer)clearInterval(runtimeTimer);
    await healthServer?.stop();
    stopMonitor();
    stopAll();
    await shutdown(s);
    await database.closeDatabase();
    log("Database closed.");
  };
  process.once("SIGINT",()=>stop("SIGINT"));
  process.once("SIGTERM",()=>stop("SIGTERM"));

  startMonitor();
  await runtimeGuard.run(()=>connectWhatsApp());
  log("Core initialized successfully.");
}
start().catch(async e=>{
  runtimeSafety?.inspect(e,"startup");
  error("Startup failed:",e);
  try{if(dbHealthTimer)clearInterval(dbHealthTimer);await database.closeDatabase()}catch{}
  process.exitCode=1;
});
