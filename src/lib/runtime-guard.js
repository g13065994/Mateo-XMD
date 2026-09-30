'use strict';

const os=require('os');
const {performance}=require('perf_hooks');

class RuntimeGuard{
  constructor({config,state,logger}={}){this.config=config;this.state=state;this.logger=logger;this.started=Date.now();this.active=0;this.failures=0;this.lastFailure=null;this.pressure={level:'normal',rssRatio:0,heapRatio:0,lagMs:0};this.lastSample=performance.now();}
  async run(task){if(typeof task!=='function')throw new TypeError('Runtime task must be a function');this.active++;try{return await task()}catch(e){this.failures++;this.lastFailure={at:new Date().toISOString(),message:e?.message||String(e)};this.state?.markError?.(e);throw e}finally{this.active--}}
  sample(){const m=process.memoryUsage();const total=os.totalmem()||1;const rssRatio=m.rss/total;const heapRatio=m.heapUsed/Math.max(m.heapTotal,1);const level=rssRatio>.85||heapRatio>.9?'critical':rssRatio>.7||heapRatio>.75?'high':'normal';this.pressure={level,rssRatio,heapRatio,lagMs:Math.max(0,performance.now()-this.lastSample-100)};this.lastSample=performance.now();this.state?.setState({runtimePressure:this.pressure});if(level!=='normal')this.logger?.warn?.(`Runtime pressure ${level}: RSS ${(rssRatio*100).toFixed(1)}%, heap ${(heapRatio*100).toFixed(1)}%.`);return this.pressure}
  snapshot(){return{uptimeMs:Date.now()-this.started,active:this.active,failures:this.failures,lastFailure:this.lastFailure,pressure:this.pressure}}
}
module.exports=RuntimeGuard;
