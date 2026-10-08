let AC;
const ctx=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();return AC};
const fq=m=>440*Math.pow(2,(m-69)/12);
function tone(f,d=.6,type='triangle',v=.35,w=0){const c=ctx(),o=c.createOscillator(),g=c.createGain(),t=c.currentTime+w;o.type=type;o.frequency.value=f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d)}
function hit(f0,f1,d,v=.8,w=0){const c=ctx(),o=c.createOscillator(),g=c.createGain(),t=c.currentTime+w;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d)}
function noise(d,hp=1500,v=.5,w=0){const c=ctx(),b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='highpass';f.frequency.value=hp;g.gain.value=v;s.buffer=b;s.connect(f);f.connect(g);g.connect(c.destination);s.start(c.currentTime+w)}
const playCorrect=()=>{tone(660,.15,'sine');tone(880,.25,'sine',.3,.12)},playWrong=()=>tone(180,.3,'sawtooth',.2);
const SOL=['دو','ري','مي','فا','صول','لا','سي'];
const DR=[['الرحماني','طبل كبير · صوت غليظ','🥁','from-red-400 to-orange-500',(w=0)=>hit(110,45,.5,.9,w)],['الكاسر','طبل صغير · صوت حاد','🪘','from-amber-400 to-yellow-400',(w=0)=>hit(320,140,.2,.8,w)],['الطار','دف دائري','⭕','from-emerald-400 to-teal-500',(w=0)=>{hit(220,120,.25,.6,w);noise(.1,3000,.2,w)}],['المسندو','طبل طويل','🛢️','from-sky-400 to-blue-500',(w=0)=>hit(160,70,.4,.8,w)],['التصفيق','بالأيدي','👏','from-pink-400 to-rose-500',(w=0)=>noise(.15,1200,.7,w)],['الجلاجل','خشخشة','🔔','from-violet-400 to-purple-500',(w=0)=>noise(.35,6000,.5,w)]];
const card=(t,b)=>`<div class="rounded-[2rem] bg-white p-5 md:p-8 shadow-chunky"><h3 class="text-2xl font-extrabold mb-4">${t}</h3>${b}</div>`;
let KH;
function piano(el){const W=[60,62,64,65,67,69,71,72,74,76,77,79,81,83],K='asdfghjkl;\'',BL=[0,1,3,4,5,7,8,10,11,12];
 el.innerHTML=card('🎹 البيانو','<p class="mb-3 text-ink/70">اضغط على المفاتيح، أو استخدم لوحة المفاتيح: A S D F G H J K L</p><div class="keys">'+W.map((m,i)=>`<button class="wk" data-m="${m}" data-k="${K[i]||''}">${SOL[i%7]}</button>`).join('')+BL.map(i=>`<button class="bk" data-m="${W[i]+1}" style="left:${(i+1)*100/14-3}%"></button>`).join('')+'</div>');
 const pl=b=>{tone(fq(+b.dataset.m),1.1);b.classList.add('on');setTimeout(()=>b.classList.remove('on'),180)};
 el.querySelectorAll('[data-m]').forEach(b=>b.onpointerdown=e=>{e.preventDefault();pl(b)});
 document.onkeydown=e=>{const b=el.querySelector(`[data-k="${e.key}"]`);if(b&&!e.repeat)pl(b)}}
function xylo(el){const C=['bg-red-400','bg-orange-400','bg-yellow-400','bg-emerald-400','bg-sky-400','bg-violet-500','bg-pink-400','bg-red-500'],M=[72,74,76,77,79,81,83,84];
 el.innerHTML=card('🌈 الإكسيليفون','<div class="flex gap-2 justify-center items-start direction-ltr" style="direction:ltr">'+M.map((m,i)=>`<button data-m="${m}" class="${C[i]} text-white font-extrabold text-xl rounded-2xl shadow-chunky flex-1 max-w-[84px]" style="height:${220-i*18}px">${SOL[i%7]}</button>`).join('')+'</div>');
 el.querySelectorAll('[data-m]').forEach(b=>b.onpointerdown=e=>{e.preventDefault();tone(fq(+b.dataset.m),.9,'sine',.5)})}
function drums(el){el.innerHTML=card('🪘 الطبول العمانية','<div class="grid grid-cols-2 md:grid-cols-3 gap-4">'+DR.map((d,i)=>`<button data-i="${i}" class="rounded-3xl bg-gradient-to-br ${d[3]} text-white p-5 shadow-chunky flex flex-col items-center min-h-36"><span class="text-5xl">${d[2]}</span><b class="text-2xl">${d[0]}</b><small class="text-white/90">${d[1]}</small></button>`).join('')+'</div>');
 el.querySelectorAll('[data-i]').forEach(b=>b.onpointerdown=e=>{e.preventDefault();DR[+b.dataset.i][4]()})}
let RT;
function rhythm(el){const R=[0,1,5],S=Array.from({length:8},()=>[0,0,0]);let bpm=100,run=0,tm;
 const dr=()=>{el.innerHTML=card('🥁 صانع الإيقاع','<p class="mb-3 text-ink/70">اضغط على الخانات لاختيار الضربات ثم شغّل.</p><div class="space-y-2" style="direction:ltr">'+R.map((d,r)=>`<div class="flex items-center gap-2"><span class="w-24 text-sm font-bold" style="direction:rtl">${DR[d][0]}</span>${S.map((s,i)=>`<button data-r="${r}" data-i="${i}" class="step flex-1 h-12 rounded-xl border-2 ${s[r]?'bg-violet-500 border-violet-600':'bg-white border-ink/20'}"></button>`).join('')}</div>`).join('')+'</div><div class="flex flex-wrap items-center gap-4 mt-5"><button id="go" class="rounded-full bg-amber-400 px-8 py-3 font-extrabold shadow-chunky">'+(run?'⏹ إيقاف':'▶ تشغيل')+'</button><label class="font-bold">السرعة: <input id="bp" type="range" min="60" max="180" value="'+bpm+'"> <b>'+bpm+'</b></label></div>');
  el.querySelectorAll('.step').forEach(b=>b.onclick=()=>{const s=S[+b.dataset.i],r=+b.dataset.r;s[r]=s[r]?0:1;if(s[r])DR[R[r]][4]();dr()});
  $('#bp').onchange=e=>{bpm=+e.target.value;dr()};$('#go').onclick=()=>{run=!run;if(run)loop(0);else clearTimeout(tm);dr()}};
 const loop=i=>{if(!run||!el.isConnected)return;S[i%8].forEach((v,r)=>v&&DR[R[r]][4]());el.querySelectorAll('.step').forEach(b=>b.style.outline=(+b.dataset.i==i%8)?'3px solid #ff9f43':'');tm=setTimeout(()=>loop(i+1),60000/bpm/2)};dr()}
