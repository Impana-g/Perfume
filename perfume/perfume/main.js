// VELA — main.js

document.addEventListener('DOMContentLoaded', () => {

  // 1. NAV SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // 2. PARTICLES
  (function initParticles() {
    const container = document.getElementById('particles');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    let W, H, particles = [];
    function resize() { W = canvas.width = container.offsetWidth; H = canvas.height = container.offsetHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    function makeParticle() {
      return { x: Math.random()*W, y: H+Math.random()*40, r: Math.random()*1.5+0.4, vx: (Math.random()-0.5)*0.4, vy: -(Math.random()*0.6+0.25), life: 0, maxLife: Math.random()*220+100, gold: Math.random()>0.55 };
    }
    for (let i=0;i<80;i++){const p=makeParticle();p.y=Math.random()*H;p.life=Math.random()*p.maxLife;particles.push(p);}
    function tick() {
      ctx.clearRect(0,0,W,H);
      particles.forEach((p,i)=>{
        p.life++;p.x+=p.vx;p.y+=p.vy;
        const progress=p.life/p.maxLife;
        const alpha=progress<0.2?progress/0.2:progress>0.8?(1-progress)/0.2:1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.gold?`rgba(201,168,76,${alpha*0.7})`:`rgba(240,234,216,${alpha*0.25})`;
        ctx.fill();
        if(p.life>=p.maxLife||p.y<-10)particles[i]=makeParticle();
      });
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // 3. SCROLL REVEAL
  const revealEls = document.querySelectorAll('[data-aos],.steps__item,.feeling__step,.feeling__left,.card,.preview__card,.stats__item,.stats__quote,.curate__left,.curate__right,.cta-final__inner');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el=>observer.observe(el));

  // 4. STAGGER DELAYS
  document.querySelectorAll('.steps__item').forEach((el,i)=>el.style.transitionDelay=`${i*0.18}s`);
  document.querySelectorAll('.feeling__step').forEach((el,i)=>el.style.transitionDelay=`${i*0.14}s`);
  document.querySelectorAll('.card').forEach((el,i)=>el.style.transitionDelay=`${i*0.12}s`);
  document.querySelectorAll('.stats__item').forEach((el,i)=>el.style.transitionDelay=`${i*0.12}s`);

  // 5. COUNTER ANIMATION
  function easeOut(t){return 1-Math.pow(1-t,3);}
  function animateCounter(el){
    const end=parseInt(el.dataset.count);if(!end)return;
    const steps=1800/16;let current=0;
    const timer=setInterval(()=>{
      current++;
      const val=Math.round(easeOut(current/steps)*end);
      el.textContent=val>=1000?(val/1000).toFixed(0)+'K+':val+'';
      if(current>=steps){clearInterval(timer);el.textContent=end>=1000?(end/1000).toFixed(0)+'K+':end+'';}
    },16);
  }
  const counterObs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.counted){e.target.dataset.counted='true';animateCounter(e.target);}});
  },{threshold:0.5});
  document.querySelectorAll('.stats__big[data-count]').forEach(el=>counterObs.observe(el));

  // 6. MODAL
  const modal=document.getElementById('quizModal');
  const modalClose=document.getElementById('modalClose');
  const modalBackdrop=document.getElementById('modalBackdrop');
  function openModal(){modal.classList.add('open');document.body.style.overflow='hidden';}
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
  document.querySelectorAll('a[href="#quiz"]').forEach(btn=>{btn.addEventListener('click',e=>{e.preventDefault();openModal();});});
  const sqb=document.getElementById('startQuizBtn');
  if(sqb)sqb.addEventListener('click',e=>{e.preventDefault();openModal();});
  modalClose.addEventListener('click',closeModal);
  modalBackdrop.addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  const modalSubmit=document.getElementById('modalSubmit');
  if(modalSubmit){
    modalSubmit.addEventListener('click',e=>{
      e.preventDefault();
      const input=document.querySelector('.modal__input');
      if(input&&input.value.trim().length>3){
        modalSubmit.textContent='DISCOVERING YOUR SCENTS…';
        modalSubmit.style.opacity='0.7';
        setTimeout(()=>{closeModal();modalSubmit.textContent='FIND MY SCENTS →';modalSubmit.style.opacity='';document.getElementById('collections').scrollIntoView({behavior:'smooth'});},1800);
      } else {
        input.style.borderColor='rgba(201,168,76,0.6)';
        input.placeholder='Please describe a moment or feeling first…';
        setTimeout(()=>{input.style.borderColor='';},1600);
      }
    });
  }

  // 7. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href=this.getAttribute('href');
      if(href==='#quiz')return;
      const target=document.querySelector(href);
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
    });
  });

  // 8. CARD HOVER GLOW
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=((e.clientX-rect.left)/rect.width*100).toFixed(1);
      const y=((e.clientY-rect.top)/rect.height*100).toFixed(1);
      card.style.background=`radial-gradient(circle at ${x}% ${y}%,#211c12 0%,var(--bg-card) 65%)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.background='';});
  });

  // 9. HERO PARALLAX
  const heroPerfume=document.querySelector('.hero__perfume');
  window.addEventListener('scroll',()=>{
    if(!heroPerfume)return;
    if(window.scrollY<window.innerHeight){
      heroPerfume.style.transform=`translateY(${window.scrollY*0.12}px)`;
    }
  },{ passive:true });

  // 10. ACTIVE NAV HIGHLIGHT
  const sections=document.querySelectorAll('section[id]');
  const navLinks=document.querySelectorAll('.nav__links a');
  const sectionObs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        navLinks.forEach(a=>{
          a.style.color=a.getAttribute('href')===`#${e.target.id}`?'var(--gold)':'';
        });
      }
    });
  },{threshold:0.4});
  sections.forEach(s=>sectionObs.observe(s));

});