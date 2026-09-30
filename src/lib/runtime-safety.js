'use strict';
class RuntimeSafety{
 constructor({state,logger}={}){this.state=state;this.logger=logger;this.incidents=[]}
 inspect(error,source='runtime'){const text=String(error?.message||error||'').toLowerCase();const category=/rate.?limit|throttl|too many/.test(text)?'rate_limit':/suspend|checkpoint|restricted|disabled|locked/.test(text)?'suspension':/auth|login|cookie|session|credential|appstate/.test(text)?'authentication':/socket|network|timeout|econn/.test(text)?'connection':'unknown';const incident={at:new Date().toISOString(),source,category,message:String(error?.message||error).slice(0,500)};this.incidents.unshift(incident);this.incidents=this.incidents.slice(0,25);this.state?.setState({safetyStatus:category==='suspension'?'paused':'attention',lastSafetyIncident:incident});if(category==='suspension')this.logger?.error?.('Safety alert: automatic retries paused for operator review.');return{...incident,action:category==='suspension'?'pause':category==='rate_limit'?'backoff':'observe'}}
 snapshot(){return{status:this.state?.getState?.().safetyStatus||'normal',incidents:this.incidents}}
}
module.exports=RuntimeSafety;
