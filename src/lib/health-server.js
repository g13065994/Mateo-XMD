'use strict';
const http=require('http');
class HealthServer{
 constructor({status,logger,port=process.env.MATEO_HEALTH_PORT||0}={}){this.status=status;this.logger=logger;this.port=Number(port)||0;this.server=null}
 start(){if(this.server)return this;this.server=http.createServer((req,res)=>{const p=new URL(req.url||'/','http://localhost').pathname;const payload=this.status?.()||{};if(p==='/health'||p==='/status'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});return res.end(JSON.stringify({ok:true,...payload}))}res.writeHead(404,{'content-type':'application/json'});res.end(JSON.stringify({error:'not_found'}))});this.server.listen(this.port,()=>this.logger?.log?.(`Health server listening on ${this.server.address().port}`));return this}
 stop(){if(!this.server)return Promise.resolve();return new Promise(r=>this.server.close(r)).then(()=>{this.server=null})}
}
module.exports=HealthServer;
