document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 900;

    // =====================================================================
    // 🎛️ 动画节奏控制面板 (单位：毫秒 ms，1000ms = 1秒)
    // =====================================================================
    const TIMING_CONFIG = {
        initBeaconAppear: 500,     

        neuronDrawInterval: 400,   
        torsoBeaconAppear: 2000,   

        heartBeatStart: 500,       
        lungBreatheStart: 500,    
        limbsMoveStart: 500,      
        // 🌟 调长了这个时间（从5500改为8000），因为第二段文字较长，给访客多留一点阅读时间
        leaveBeaconAppear: 3500,   

        flowEffectStart: 500,      
        textBeaconAppear: 3500,    
        finalReset: 5500          // 调长了结尾重置时间，让访客读完最终的名人名言
    };
    // =====================================================================


    // === 1. DOM 元素获取 ===
    const storyTitle = document.getElementById('story-title');
    const storyContent = document.getElementById('story-content');
    const hintBeacon = document.getElementById('hint-beacon');
    
    const hoverHead = document.getElementById('hover_x5F_head');
    const hoverTorso = document.getElementById('hover_x5F_torso');

    const nervousSystem = [
        document.querySelectorAll('#brain path'),
        document.querySelectorAll('#spine path'),
        document.querySelectorAll('#neuron path')
    ];
    const leftArmDef = document.getElementById('left_arm');
    const leftArmLift = document.getElementById('left_arm_x5F_lift');
    const rightLegDef = document.getElementById('right_leg');
    const rightLegLift = document.getElementById('right_leg_x5F_lift');
    const heart = document.getElementById('heart');
    const lung = document.getElementById('lung');
    
    const flowContainer = document.getElementById('flow-container');
    const shiverEffect = document.getElementById('shiver-effect');
    const fullBodyStatic = document.getElementById('full-body-static');
    const outlineGroup = document.getElementById('outline');


    // === 2. 初始化功能 ===
    const setCenter = (el) => {
        const bbox = el.getBBox();
        el.style.transformOrigin = `${bbox.x + bbox.width / 2}px ${bbox.y + bbox.height / 2}px`;
    };
    setCenter(heart); setCenter(lung);

    nervousSystem.forEach(group => {
        group.forEach(path => {
            const length = path.getTotalLength();
            path.dataset.len = length; 
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length; 
            path.style.transition = 'stroke-dashoffset 0.6s ease-in-out';
        });
    });

    const flowPaths = flowContainer.getElementsByTagName('path');
    for (let path of flowPaths) {
        path.classList.remove('st0'); 
        path.classList.add('flow-line');
        const len = path.getTotalLength();
        const cycleTime = (Math.random() * 10 + 10).toFixed(2); 
        const initialDelay = (Math.random() * 10).toFixed(2);
        const animName = `f${Math.random().toString(36).substr(2, 9)}`;
        const style = document.createElement('style');
        style.innerHTML = `@keyframes ${animName} { 0% { stroke-dashoffset: ${len}; opacity: 0; } 1% { opacity: 1; } 10% { stroke-dashoffset: ${-len}; opacity: 1; } 11%, 100% { stroke-dashoffset: ${-len}; opacity: 0; } }`;
        document.head.appendChild(style);
        path.style.strokeDasharray = len;
        path.style.animation = `${animName} ${cycleTime}s linear ${initialDelay}s infinite`;
    }


    // === 3. 智能光标追踪系统 ===
    let currentBeaconTarget = null; 

    const updateBeaconPosition = () => {
        if (!currentBeaconTarget) return;
        const targetEl = document.getElementById(currentBeaconTarget);
        if (!targetEl) return;

        const rect = targetEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        let yOffsetRatio = 0.5;
        if (currentBeaconTarget === 'hover_x5F_torso') yOffsetRatio = 0.25; 
        
        const centerY = rect.top + rect.height * yOffsetRatio;

        hintBeacon.style.left = `${centerX}px`;
        hintBeacon.style.top = `${centerY}px`;
    };

    const setBeaconToTarget = (targetId) => {
        currentBeaconTarget = targetId;
        updateBeaconPosition();
        hintBeacon.style.opacity = 1;
    };

    const setBeaconByViewport = (vw, vh) => {
        currentBeaconTarget = null; 
        hintBeacon.style.left = `${vw}vw`;
        hintBeacon.style.top = `${vh}vh`;
        hintBeacon.style.opacity = 1;
    };

    const hideBeacon = () => { hintBeacon.style.opacity = 0; };

    window.addEventListener('resize', updateBeaconPosition);


    // === 4. 互动剧情状态机与文案剧本 ===
    let currentStep = 0; 
    
    // 🌟 填入你富有诗意的完整文案 (使用 <br> 进行优雅的换行排版)
    const scripts = {
        init: { 
            title: "Who am I?", 
            text: "What draws the outline of the “I”?" 
        },
        brain: { 
            title: "Is it in my brain?", 
            text: "How does the brain represent me?<br>The prefrontal cortex, the amygdala. <br>Neurotransmitters, pathways, networks.<br>The central and peripheral nervous systems.<br>Neurons, glial cells.<br>Memory. Representation. Images of the world.<br><br>If the brain is the organ of the “mind,”<br>then where does the brain end?" 
        },
        torso: { 
            title: "Is it in my body?", 
            text: "Tightened limbs, hair standing on end.<br>A racing heart, quickened breath.<br>Warmth felt in sunlight.<br>The softness of soil under my feet.<br>Slowing down, loosening, in an embrace.<br><br>Why am I a human being,<br>and not just another animal,<br>or a plant among all things in nature?" 
        },
        flow: { 
            title: "Does it emerge from my environment?", 
            text: "Conforming to, or resisting against.<br>Educated by, rebellious against.<br>Attached to, afraid of.<br>Traumatized by, tempted to.<br><br>Am I in my passions or in my addictions<br>—in the ego, or in the symptoms?" 
        },
        end: { 
            title: "An Inquiry into the Self", // 结尾的标题，你也可以留空 "" 
            text: "<div class='quote-text'>\"Psychopathology is limited in that there can be no final analysis of human beings as such, since the more we reduce them to what is typical and what is normative the more we realise there is something hidden in every human individual which defies recognition.\"</div><br>— Karl Jaspers, <i>General Psychopathology</i>" 
        }
    };

    // 🌟 全新的温和文字切换逻辑
    const updateText = (key, immediate = false) => {
        // 如果是初始化，不使用渐变，直接显示
        if (immediate) {
            storyTitle.innerHTML = scripts[key].title;
            storyContent.innerHTML = scripts[key].text;
            return;
        }

        // 1. 旧文字淡出
        storyTitle.classList.add('text-fade-out');
        storyContent.classList.add('text-fade-out');

        // 2. 等待淡出动画完成（800ms，需与 CSS 保持一致）
        setTimeout(() => {
            // 替换文字内容
            storyTitle.innerHTML = scripts[key].title;
            storyContent.innerHTML = scripts[key].text;
            
            // 3. 新文字淡入
            storyTitle.classList.remove('text-fade-out');
            storyContent.classList.remove('text-fade-out');
        }, 800);
    };

   // ---------------------------------------------
    // 【流程正式启动】
    // ---------------------------------------------
    
    updateText('init', true); // true 表示立即显示，无延迟
    setTimeout(() => { 
        setBeaconToTarget('hover_x5F_head'); 
    }, TIMING_CONFIG.initBeaconAppear);

    // === 新增：重置所有状态的函数 ===
    const resetStory = () => {
        currentStep = 0;
        updateText('init', true); // 瞬间切回初始文字
        
        // 1. 重置神经系统
        nervousSystem.forEach(group => {
            if (group[0] && group[0].parentElement) {
                group[0].parentElement.style.opacity = 0;
            }
            group.forEach(path => { 
                path.style.strokeDashoffset = path.dataset.len; 
            });
        });

        // 2. 重置心肺与四肢
        heart.classList.remove('active-heart'); 
        lung.classList.remove('active-lung');
        leftArmDef.classList.remove('anim-limb-default'); 
        rightLegDef.classList.remove('anim-limb-default');
        leftArmLift.classList.remove('anim-limb-lift'); 
        rightLegLift.classList.remove('anim-limb-lift');
        leftArmLift.style.display = 'none'; 
        rightLegLift.style.display = 'none';

        // 3. 重置背景与轮廓特效
        flowContainer.style.opacity = 0;
        shiverEffect.style.opacity = 0;
        fullBodyStatic.style.opacity = 0;
        outlineGroup.style.opacity = 1;

        // 4. 重新启动初始引导光标
        setTimeout(() => { 
            setBeaconToTarget('hover_x5F_head'); 
        }, TIMING_CONFIG.initBeaconAppear);
    };

    // 【第一幕：点击头部】
    hoverHead.addEventListener('click', (e) => {
        if (currentStep === 0) {
            e.stopPropagation(); // 阻止事件冒泡，防止触发背景点击
            currentStep = 1;
            hideBeacon(); 
            updateText('brain'); 
            
            nervousSystem.forEach((group, i) => {
                group[0].parentElement.style.opacity = 1; 
                setTimeout(() => { group.forEach(path => path.style.strokeDashoffset = 0); }, i * TIMING_CONFIG.neuronDrawInterval);
            });
            
            

 setTimeout(() => {

        setBeaconToTarget('hover_x5F_torso');
    
}, TIMING_CONFIG.textBeaconAppear);



        }
    });

    // 【第二幕：点击躯干】
    hoverTorso.addEventListener('click', (e) => {
        if (currentStep === 1) {
            e.stopPropagation(); // 阻止事件冒泡
            currentStep = 2;
            hideBeacon();
            updateText('torso'); 
            
            nervousSystem.forEach(group => {
                group[0].parentElement.style.opacity = 0;
                group.forEach(path => { path.style.strokeDashoffset = path.dataset.len; });
            });

            setTimeout(() => { heart.classList.add('active-heart'); }, TIMING_CONFIG.heartBeatStart);
            setTimeout(() => { lung.classList.add('active-lung'); }, TIMING_CONFIG.lungBreatheStart);
            setTimeout(() => { 
                leftArmLift.style.display = 'block'; rightLegLift.style.display = 'block';
                leftArmDef.classList.add('anim-limb-default'); rightLegDef.classList.add('anim-limb-default');
                leftArmLift.classList.add('anim-limb-lift'); rightLegLift.classList.add('anim-limb-lift');
            }, TIMING_CONFIG.limbsMoveStart);
            
            // 引导光标指向画面外部，暗示点击环境

    setTimeout(() => {
    if (window.innerWidth <= 900) {
        // 手机
        setBeaconByViewport(70, 75);
    } else {
        // 桌面
        setBeaconByViewport(85, 50);
    }
}, TIMING_CONFIG.textBeaconAppear);
        }
    });

// 【第三幕 -> 最终落幕 -> 重置：点击页面任意背景区域】
    document.addEventListener('click', () => {
        // 当处于第二幕且被点击时，进入第三幕 (环境)
        if (currentStep === 2) {
            currentStep = 3;
            hideBeacon();
            updateText('flow'); 
            
            leftArmDef.classList.remove('anim-limb-default'); rightLegDef.classList.remove('anim-limb-default');
            leftArmLift.classList.remove('anim-limb-lift'); rightLegLift.classList.remove('anim-limb-lift');
            heart.classList.remove('active-heart'); lung.classList.remove('active-lung');

            setTimeout(() => {
                outlineGroup.style.opacity = 0; 
                fullBodyStatic.style.opacity = 1; 
                shiverEffect.style.opacity = 1; 
                flowContainer.style.opacity = 1; 
            }, TIMING_CONFIG.flowEffectStart);

            // 引导光标指向文字区域，暗示用户读完后继续点击
            setTimeout(() => {
    if (window.innerWidth <= 900) {
        // 手机
        setBeaconByViewport(70, 35);
    } else {
        // 桌面
        setBeaconByViewport(45, 50);
    }
}, TIMING_CONFIG.textBeaconAppear);

            // 注：已移除这里的自动进入落幕状态的 setTimeout
        } 
        // === 新增：当处于第三幕被点击时，手动进入第四幕 (落幕) ===
        else if (currentStep === 3) {
            currentStep = 4;
            updateText('end'); 
            
            flowContainer.style.opacity = 0;
            shiverEffect.style.opacity = 0;
            fullBodyStatic.style.opacity = 0;
            outlineGroup.style.opacity = 1;
            hideBeacon();
        }
        // === 当处于最终落幕状态被点击时，全局重置 ===
        else if (currentStep === 4) {
            resetStory();
        }
    });
});