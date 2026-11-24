// tiny stack ISA v1 VM: node main.ts [in] [out]
import{mkdirSync as M,readdirSync as D,readFileSync as R,writeFileSync as W}from'node:fs'
const[,,I='/input',O='/output']=process.argv,T:string[]=[]
// pops,pushes,imm:opcodes
for(const g of'000:0,34 011:1 014:2 100:3,50,51,53 120:4 220:5 230:6 330:7 210:10,11,12,13,14,15,16,18,19,1a,1c,1d,1e,20,21,22 110:17,1b,40 002:30,33 102:31,32 200:41 010:52'.split(' ')){const[k,l]=g.split(':');for(const h of l.split(','))T[parseInt(h,16)]=k}
function V(p:Uint8Array,q:Uint8Array):[number[],number]{
const s=new Int32Array(257),m=new Int32Array(256),r:number[]=[],o:number[]=[],L=p.length
let z=0,c=0,i=0,n=0,e=-1,a=0,b=0,x=0,t,k
const J=()=>x+((p[x-2]|p[x-1]<<8)<<16>>16),P=(d:number[])=>o.length+d.length>65536?e=11:(o.push(...d),z--)
while(e<0){
if(n++>=1e6){e=10;break}
if(c<0||c>=L){e=9;break}
k=p[c];t=T[k]
if(!t){e=5;break}
x=c+1+ +t[2]
if(x>L){e=9;break}
if(z<+t[0]){e=2;break}
if(z-+t[0]+ +t[1]>256){e=3;break}
c=x
switch(k){
case 0:e=0;break
case 1:s[z++]=p[x-1]<<24>>24;break
case 2:s[z++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break
case 3:z--;break
case 4:s[z]=s[z-1];z++;break
case 5:a=s[z-2];s[z-2]=s[z-1];s[z-1]=a;break
case 6:s[z]=s[z-2];z++;break
case 7:a=s[z-3];s[z-3]=s[z-2];s[z-2]=s[z-1];s[z-1]=a;break
case 23:s[z-1]=-s[z-1];break
case 27:s[z-1]=~s[z-1];break
case 48:c=J();break
case 49:if(!s[--z])c=J();break
case 50:if(s[--z])c=J();break
case 51:if(r.length>63)e=7;else r.push(x),c=p[x-2]|p[x-1]<<8;break
case 52:if(r.length)c=r.pop()!;else e=8;break
case 64:a=s[z-1];if(a<0||a>255)e=6;else s[z-1]=m[a];break
case 65:a=s[z-1];if(a<0||a>255)e=6;else m[a]=s[z-2],z-=2;break
case 80:P([...''+s[z-1]].map(h=>h.charCodeAt(0)));break
case 81:P([s[z-1]&255]);break
case 82:s[z++]=i<q.length?q[i++]:-1;break
case 83:e=s[z-1]&255;break
default:
b=s[--z];a=s[z-1]
if(!b&&k>18&&k<23){e=4;break}
// Int32Array wraps; shifts use count&31
s[z-1]=k==16?a+b:k==17?a-b:k==18?Math.imul(a,b):k==19?a/b:k==20?a%b:k==21?(a>>>0)/(b>>>0):k==22?(a>>>0)%(b>>>0):k==24?a&b:k==25?a|b:k==26?a^b:k==28?a<<b:k==29?a>>b:k==30?a>>>b:k==32?+(a==b):k==33?+(a<b):+(a>>>0<b>>>0)}}
return[o,e]}
const f=(d:string,n:string)=>{try{return R(I+'/'+d+'/'+n+'.bin')}catch{return new Uint8Array}}
for(const d of D(I).sort()){let v:[number[],number]
try{v=V(f(d,'program'),f(d,'input'))}catch{v=[[],0]}
M(O+'/'+d,{recursive:true});W(O+'/'+d+'/stdout.bin',Uint8Array.from(v[0]));W(O+'/'+d+'/exit.txt',v[1]+'\n')}
