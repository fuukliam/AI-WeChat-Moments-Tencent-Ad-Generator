const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // --- 1. Core State & Defaults ---
        const inputRaw = ref("阿里巴巴集团"); // Default to Alibaba only
        const mode = ref('ai'); // Default to AI mode
        const aspectRatio = ref('horizontal');
        const results = ref([]);
        const isGenerating = ref(false);
        const processedCount = ref(0);
        // Compute total based on input lines
        const companyList = computed(() => {
            return inputRaw.value.split('\n').filter(line => line.trim() !== '');
        });
        const totalCount = computed(() => companyList.value.length);
        const progressPercent = computed(() => {
            if (totalCount.value === 0) return 0;
            return Math.round((processedCount.value / totalCount.value) * 100);
        });

        // --- 2. Custom Prompts (Editable) ---
        // Logo提示词
        const logoPromptTemplate = ref("为品牌“{name}”设计一个图标形式的Logo。核心元素：风格：扁平化矢量，主色调鲜明（依据品牌定位选择），高辨识度，极简干净。避免使用过多细节，确保即使在小尺寸下也能清晰辨认。无任何文字说明。");

        // 文案系统提示词
        const copySystemPrompt = ref("你是一位资深社交媒体文案专家，精通朋友圈短文案创作，擅长用亲切专业的语言传递品牌价值");

        // 文案用户提示词
        const copyUserPrompt = ref("为“{name}”创作一条富有感染力的微信朋友圈广告文案：突出产品/服务的独特卖点及用户价值，用温暖且具说服力的语言表达，激发用户的兴趣与行动欲望。严格控制在30字内，直接输出文案内容。");

        // Slogan提示词
        const sloganPromptTemplate = ref("为品牌“{name}”构思一句简短有力的海报主标题。要求：4-8个汉字，精准传达品牌核心价值或解决用户痛点，语言简洁直接，易于记忆，适合快速传播。不要标点符号，纯文本输出。");

        // --- 核心优化：回归业务相关性，兼顾高级感 ---
        // 这是一个“思维链”提示词，强制AI根据品牌名推导行业，而不是随机画图。
        const imagePromptTemplate = ref(`
为品牌“{name}”设计一张商业海报底图。

【第一步：行业联想（重要）】
请先分析“{name}”的品牌名称，推断其所属行业（如：医疗、电力、燃气、科技、机械、餐饮等）。
**画面的所有元素必须与该行业直接相关！**
- 如果是**医疗**：必须出现医生、听诊器、CT机、胶囊、DNA链或医院环境。
- 如果是**燃气/能源**：必须出现蓝色火焰、管道、仪表盘、输电塔或光伏板。
- 如果是**机械/科技**：必须出现齿轮、芯片、机械臂、电路板或服务器。

【第二步：风格与构图（随机抽取一种，保持多样性）】
请从以下3种视角中，选择最适合该行业的一种进行绘制：

**选项A：【专业服务·人物特写】（高相关性）**
- 画面主体：一位身穿**该行业职业制服**的中国专业人士（Chinese professional）。
- 动作：正在专注地使用**该行业的典型工具**进行工作（如医生拿听诊器，电工拿检修仪）。
- 构图：人物位于画面**右下角或底部**，采用仰拍视角，背景是模糊的工作环境。
- 目的：传递“专业、服务、靠谱”。

**选项B：【核心产品·艺术重构】（高逼格）**
- 画面主体：该行业的**核心产品或象征符号**的3D特写。
- 表现手法：使用C4D渲染风格，材质为**磨砂玻璃、金属或发光体**。
- 例子：如果是燃气公司，画一个晶莹剔透的**蓝色火焰**；如果是医疗，画一个悬浮的**发光胶囊或心脏模型**。
- 构图：主体悬浮在画面中心偏下，背景干净。

**选项C：【作业场景·宏大叙事】（高信任感）**
- 画面主体：该行业的**典型作业场景**（空镜或远景人物）。
- 内容：如干净明亮的医院走廊（医疗）、整齐的天然气管道设施（燃气）、现代化的工厂车间（制造）。
- 构图：大透视、大景深，顶部留出大面积天空或墙面作为负空间。

【第三步：强制约束】
1. **留白**：画面上半部分（Top 50%）必须干净、简单（天空/纯色/虚化），用于写字。
2. **负向提示（绝对禁止）**：禁止出现文字、水印、LOGO；禁止出现与行业无关的物体（如给医疗公司画齿轮，给燃气公司画听诊器）；禁止恐怖、阴暗。

【画质】：4K分辨率，商业摄影光效，色彩准确（医疗用蓝白，燃气用橙蓝，科技用黑金）。
`);

        // --- 3. Mock Data & Templates ---
        const copyTemplates = [
            "引领未来科技，{name}为您创造无限可能。",
            "{name}，专注品质服务，打造行业标杆。",
            "创新驱动发展，{name}与您共创辉煌。",
            "选择{name}，就是选择专业与信赖。",
            "年终大促！{name}感恩回馈，好礼送不停。"
        ];

        const mockImages = [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
        ];

        const mockLogos = [
            "https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=",
            "https://ui-avatars.com/api/?background=random&rounded=true&name="
        ];

        // --- 4. API Helpers (Server-Side Proxy) ---
        // Requests go to local /api endpoints (e.g. /api/generate-text), 
        // which server.js handles and relays to Alibaba Cloud.

        // Helper: Generic Qwen Call
        const callQwenApi = async (systemPrompt, userPrompt) => {
            try {
                // Call local server endpoint
                const response = await fetch('/api/generate-text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "qwen-turbo",
                        input: {
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt }
                            ]
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                if (data.output && data.output.text) {
                    return data.output.text.replace(/["“”]/g, '').trim(); // Clean quotes
                }
                throw new Error("No text output");
            } catch (e) {
                console.error("Text Gen Error:", e);
                return null;
            }
        };

        // Helper: Call Wanx-Turbo for Image
        const callWanxTurbo = async (prompt) => {
            try {
                // Call local server endpoint
                const submitResponse = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "wanx2.0-t2i-turbo",
                        input: { prompt: prompt },
                        parameters: { size: "1024*1024", n: 1 }
                    })
                });

                if (!submitResponse.ok) {
                    const errText = await submitResponse.text();
                    throw new Error(`Submission Failed: ${submitResponse.status} - ${errText}`);
                }

                const submitData = await submitResponse.json();
                if (!submitData.output || !submitData.output.task_id) throw new Error("Task submission failed");

                const taskId = submitData.output.task_id;

                // Poll for status
                let retries = 0;
                while (retries < 60) { // Max 120s
                    await new Promise(r => setTimeout(r, 2000));
                    // Call local server endpoint
                    const statusResponse = await fetch(`/api/task/${taskId}`, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const statusData = await statusResponse.json();
                    const status = statusData.output.task_status;

                    if (status === 'SUCCEEDED') return statusData.output.results[0].url;
                    if (status === 'FAILED') throw new Error("Generation failed: " + statusData.output.message);
                    retries++;
                }
                throw new Error("Timeout");
            } catch (e) {
                console.error("Image Gen Error:", e);
                return null;
            }
        };

        // --- 5. Main Generation Logic (Queue System) ---
        const generateBatch = async () => {
            isGenerating.value = true;
            processedCount.value = 0;

            // Initialize results with pending placeholders immediately
            results.value = companyList.value.map(name => ({
                name: name.trim(),
                logo: mockLogos[1] + encodeURIComponent(name.substring(0, 2)),
                copy: '正在连接服务器生成...',
                slogan: '',
                sloganStyle: 0,
                image1: 'https://via.placeholder.com/600x400?text=Waiting+for+Server...',
                orientation: aspectRatio.value,
                status: 'pending'
            }));

            // Simulation Mode: Fast Loop
            if (mode.value === 'simulation') {
                for (let i = 0; i < results.value.length; i++) {
                    const item = results.value[i];
                    await new Promise(r => setTimeout(r, 200));

                    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    item.logo = `https://ui-avatars.com/api/?background=${randomColor}&color=fff&rounded=true&size=128&name=${encodeURIComponent(item.name.substring(0, 2))}`;
                    item.copy = copyTemplates[Math.floor(Math.random() * copyTemplates.length)].replace('{name}', item.name);
                    item.slogan = "品质之选 · 值得信赖"; // Mock slogan
                    item.sloganStyle = Math.floor(Math.random() * 20); // Random Style 0-19
                    item.image1 = mockImages[Math.floor(Math.random() * mockImages.length)];
                    item.status = 'done';

                    setTimeout(() => {
                        const textarea = document.querySelector(`#card-${i} .native-copy-input`);
                        if (textarea) adjustHeight(textarea);
                    }, 0);
                }
                isGenerating.value = false;
                return;
            }

            // AI Mode: Serial Processing (Stable)
            const CONCURRENCY_LIMIT = 1; // Changed from 3 to 1 to prevent API rate limits/stalls
            let currentIndex = 0;

            const processNext = async () => {
                if (currentIndex >= results.value.length) return;

                // Add a small delay before processing to be gentle on API
                await new Promise(r => setTimeout(r, 1000));

                const index = currentIndex++;
                const item = results.value[index];
                item.status = 'processing';
                console.log(`Processing ${index + 1}/${results.value.length}: ${item.name}`);

                try {
                    const name = item.name;
                    // Prepare prompts
                    const logoPrompt = logoPromptTemplate.value.replace('{name}', name);

                    // --- 关键修改：直接使用新模板替换，强制AI联想行业 ---
                    const imagePrompt = imagePromptTemplate.value.replace(/{name}/g, name);

                    const copyInput = copyUserPrompt.value.replace('{name}', name);
                    const sloganInput = sloganPromptTemplate.value.replace('{name}', name);

                    // Run API calls in parallel (Now 4 calls)
                    const [logoUrl, copyText, sloganText, mainImageUrl] = await Promise.all([
                        callWanxTurbo(logoPrompt),
                        callQwenApi(copySystemPrompt.value, copyInput),
                        callQwenApi("你是一个资深平面设计师。", sloganInput),
                        callWanxTurbo(imagePrompt)
                    ]);

                    // Update Item
                    item.logo = logoUrl || 'https://via.placeholder.com/128x128/ff0000/ffffff?text=Retry';
                    item.copy = copyText || `${name}（文案生成失败）`;
                    item.slogan = sloganText || item.name;
                    item.sloganStyle = Math.floor(Math.random() * 4);
                    item.image1 = mainImageUrl || 'https://via.placeholder.com/600x400/eeeeee/999999?text=Generation+Failed';
                    item.status = 'done';

                    setTimeout(() => {
                        const textarea = document.querySelector(`#card-${index} .native-copy-input`);
                        if (textarea) adjustHeight(textarea);
                    }, 0);

                } catch (err) {
                    console.error(`Error processing ${item.name}`, err);
                    item.status = 'error';
                    item.copy = "生成失败：请确认服务器已正常运行";
                } finally {
                    processedCount.value++;
                }

                // Recursive call for next item
                await processNext();
            };

            // Start initial pool
            const pool = [];
            for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
                pool.push(processNext());
            }

            await Promise.all(pool);
            isGenerating.value = false;
        };

        // --- 6. Helper Functions ---
        const regenerateImage = async (index, type) => {
            const item = results.value[index];

            if (mode.value === 'ai') {
                // AI Mode: Call API
                const originalUrl = item[type];
                item[type] = 'https://via.placeholder.com/150?text=Generating...';

                try {
                    let newUrl = '';
                    if (type === 'logo') {
                        const prompt = logoPromptTemplate.value.replace('{name}', item.name);
                        newUrl = await callWanxTurbo(prompt);
                    } else if (type === 'image1') {
                        // --- 关键修改：重新生成时也使用行业联想模板 ---
                        const prompt = imagePromptTemplate.value.replace(/{name}/g, item.name);
                        newUrl = await callWanxTurbo(prompt);
                    }
                    if (newUrl) item[type] = newUrl;
                    else item[type] = originalUrl; // Revert on failure
                } catch (e) {
                    console.error("Regen failed:", e);
                    item[type] = originalUrl;
                    alert("生成失败，请重试");
                }
            } else {
                // Simulation Mode
                if (type === 'logo') {
                    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    item.logo = `https://ui-avatars.com/api/?background=${randomColor}&color=fff&rounded=true&size=128&name=${encodeURIComponent(item.name.substring(0, 2))}`;
                } else if (type === 'image1') {
                    let newImg = mockImages[Math.floor(Math.random() * mockImages.length)];
                    while (newImg === item[type]) {
                        newImg = mockImages[Math.floor(Math.random() * mockImages.length)];
                    }
                    item[type] = newImg;
                }
            }
        };

        const regenerateCopy = async (index) => {
            const item = results.value[index];

            if (mode.value === 'ai') {
                const originalCopy = item.copy;
                item.copy = "正在重新生成...";
                try {
                    const userContent = copyUserPrompt.value.replace('{name}', item.name);
                    const newCopy = await callQwenApi(copySystemPrompt.value, userContent);
                    if (newCopy) item.copy = newCopy;
                    else item.copy = originalCopy;
                } catch (e) {
                    item.copy = originalCopy;
                    alert("生成失败");
                }
            } else {
                const template = copyTemplates[Math.floor(Math.random() * copyTemplates.length)];
                item.copy = template.replace('{name}', item.name);
            }

            setTimeout(() => {
                const textarea = document.querySelectorAll(`#card-${index} .native-copy-input`)[0];
                if (textarea) adjustHeight(textarea);
            }, 100);
        };

        const adjustHeight = (el) => {
            if (!el) return;
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 'px';
        };

        // Helper: Convert remote URL to local proxy URL for html2canvas
        const proxified = (url) => {
            if (!url) return '';
            if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
            return `/proxy-image?url=${encodeURIComponent(url)}&_t=${Date.now()}`;
        };

        const downloadAll = async () => {
            const zip = new JSZip();
            const cards = document.querySelectorAll('.promo-card');

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const canvas = await html2canvas(card, {
                    useCORS: true,
                    scale: 2
                });
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const companyName = results.value[i].name;
                zip.file(`${companyName}.png`, blob);
            }

            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    saveAs(content, "promo-cards.zip");
                });
        };

        return {
            inputRaw,
            mode,
            aspectRatio,
            results,
            isGenerating,
            companyList,
            generateBatch,
            downloadAll,
            regenerateImage,
            regenerateCopy,
            adjustHeight,
            proxified,
            processedCount,
            totalCount,
            progressPercent,
            // Exposed prompts for UI/Edit
            logoPromptTemplate,
            copySystemPrompt,
            copyUserPrompt,
            sloganPromptTemplate,
            imagePromptTemplate
        };
    }
}).mount('#app');