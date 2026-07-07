export const sourceNotes = [
  {
    title: '一支烟花AI社区介绍',
    type: '墨问公开 meta',
    status: '可公开读取标题、作者和摘要',
    url: 'https://note.mowen.cn/detail/mQcaY_6GxndRz6_g8m5Uw?code=jc1ShFKLB7tkan9v',
    summary:
      '公开摘要显示社区成立于 2023 年底，核心成员具备互联网与技术背景。本页只引用公开 meta 层信息。',
  },
  {
    title: '21 首次公开！一支烟花社区背后的运营思考',
    type: '墨问公开 meta',
    status: '可公开读取标题、作者和摘要',
    url: 'https://note.mowen.cn/detail/zJ8qV_BZUOjyvkRfwXytU',
    summary:
      '公开摘要强调社区定位、用户留存、差异化策略和 AI 社区建设方法。',
  },
  {
    title: '社区社群介绍',
    type: '飞书文档',
    status: '当前返回登录页，未直接引用正文',
    url: 'https://hqexj12b0g.feishu.cn/docx/TyymdoAdRodWGJxCi6FcJvEUn2b',
    summary:
      '作为加入社区和内部介绍入口保留链接；公开页面不写入不可验证正文。',
  },
  {
    title: '公众号：一支烟花 AI',
    type: '用户提供截图',
    status: '用于展示公开主页信息和二维码',
    url: '#official-account',
    summary:
      '公众号主页显示其专注硬核 AI 内容，包含原创内容数量、视频号入口和扫码关注二维码。',
  },
];

export const projectStats = {
  repos: 19,
  stars: '9,000+',
  forks: '800+',
  updatedAt: '2026-07-05',
  source: 'GitHub REST API / yizhiyanhua-ai public repositories',
};

export const officialAccount = {
  name: '一支烟花 AI',
  location: '上海 长宁',
  tagline: '专注硬核 AI 内容，高质量 AI 洞见独一无二的一支烟花 AI 社区一群有极客精神的 AI 人',
  videoChannel: '一支烟花 AI',
  originalPosts: 223,
  source: '公众号主页截图，用户提供于 2026-07-06',
  qrImage: '/fireworks/assets/wechat-qrcode.jpg',
  profileImage: '/fireworks/assets/wechat-content-preview.jpg',
};

export const contentTracks = [
  {
    title: 'Agent 与 AI 产品',
    body: '追踪 Agentic Thinking、Agent Wars、AI 原生产品和 SaaS 替代路径，关注产品判断与真实落地。',
    accent: 'orange',
  },
  {
    title: 'RAG / Memory / 基础设施',
    body: '拆解 RAG、Paged Attention、长期记忆、模型基础设施与工程架构，把论文和实践连起来。',
    accent: 'blue',
  },
  {
    title: 'AI 创业与商业化',
    body: '观察 Anthropic、微软、垂直 AI 产品和增长机制，讨论技术如何进入真实业务。',
    accent: 'gold',
  },
  {
    title: '开源工具与共创项目',
    body: '从文章里的问题出发，沉淀脚本、Skill、演示站点和开源仓库，让内容继续变成工具。',
    accent: 'green',
  },
];

export const communityIntro = {
  founded: '2023 年底',
  headline: '一支烟花 AI，是硬核 AI 内容与共创实验室。',
  body:
    '社区从公众号的深度内容、GitHub 开源项目和社群共创出发，长期关注 AI 产品、Agent、模型基础设施、开源工具和真实落地案例。每一次观察、复盘和实验，都尽量沉淀成下一位实践者可以复用的公开资产。',
  notes: [
    {
      label: '定位',
      value: '硬核 AI 内容 + 开源项目 + 学习共创',
    },
    {
      label: '方法',
      value: '用真实问题驱动文章、工具、教程和演示站点',
    },
    {
      label: '边界',
      value: '公开内容优先，不暴露私密群聊、个人隐私和未授权资料',
    },
  ],
};

export const communityBeliefs = [
  {
    title: '让 AI 学习从信息消费走向作品生产',
    body: '关注能跑起来的脚本、Skill、工作流和复盘，而不只停留在观点和资讯。',
  },
  {
    title: '让个人经验变成团队可以继承的资产',
    body: '把方法写进 README、图谱、模板、演示站点和可验证的开源项目。',
  },
  {
    title: '让社区运营回到真实用户和长期留存',
    body: '重视定位、差异化、用户需求和持续参与，而不是短期流量热闹。',
  },
];

export const featuredProjects = [
  {
    name: 'fireworks-tech-graph',
    category: 'AI 创作与表达',
    productType: 'Technical Visual AI',
    tagline: 'Prompt-to-diagram 技术图生成器',
    useCase: '技术图生成 / 架构表达 / Agent 流程可视化',
    outcome: '把自然语言里的系统想法，直接变成可发布、可复用的 SVG + PNG 技术图。',
    launchRank: '#1',
    upvotes: '8.3k',
    previewType: 'diagram',
    highlights: ['自然语言生成技术图', '多种架构图风格', 'SVG + PNG 可发布输出'],
    description:
      '用自然语言生成可发布的 SVG + PNG 技术图，覆盖 Agent、RAG、UML 与多种视觉风格。',
    url: 'https://github.com/yizhiyanhua-ai/fireworks-tech-graph',
    demo: 'https://yizhiyanhua-ai.github.io/fireworks-tech-graph/',
    stars: 8355,
    forks: 722,
    language: 'Python',
    tags: ['AI diagrams', 'SVG/PNG', 'Agent workflow'],
    accent: 'blue',
    flagship: true,
  },
  {
    name: 'fireworks-design',
    category: 'AI 创作与表达',
    productType: 'Multi-agent Design Studio',
    tagline: '多 Agent 前端设计工作台',
    useCase: '前端页面生成 / 多方向探索 / 设计评审',
    outcome: '把“想做一个页面”升级成多 Agent 并行探索、评审、融合和对抗打磨的设计流水线。',
    launchRank: '#2',
    upvotes: '48',
    previewType: 'design',
    highlights: ['多方向并行探索', '面板评审与融合', '页面生成工作流'],
    description:
      'Claude Code 工作流：多方向探索、面板评审、融合与对抗打磨，生成高质量前端页面。',
    url: 'https://github.com/yizhiyanhua-ai/fireworks-design',
    demo: 'https://yizhiyanhua-ai.github.io/fireworks-design/',
    stars: 48,
    forks: 2,
    language: 'HTML',
    tags: ['Frontend', 'Multi-agent', 'Design system'],
    accent: 'purple',
    flagship: true,
  },
  {
    name: 'fireworks-skill-memory',
    category: 'AI 记忆与知识系统',
    productType: 'Skill Memory OS',
    tagline: '让 AI 工具越用越懂你',
    useCase: '技能记忆 / 经验复用 / 跨会话上下文',
    outcome: '让 Claude Code 与 Codex Skills 沉淀按技能分层的经验，减少重复探索。',
    launchRank: '#3',
    upvotes: '92',
    previewType: 'memory',
    highlights: ['技能分层记忆', '跨会话复用', 'Codex / Claude Code 友好'],
    description:
      '为 Claude Code 与 Codex Skills 提供按技能分层的持久化经验记忆，让工具越用越懂上下文。',
    url: 'https://github.com/yizhiyanhua-ai/fireworks-skill-memory',
    demo: 'https://yizhiyanhua-ai.github.io/fireworks-skill-memory/',
    stars: 92,
    forks: 7,
    language: 'Python',
    tags: ['Memory', 'Skills', 'Codex'],
    accent: 'green',
  },
  {
    name: 'fireworks-ai-tools-memory',
    category: 'AI 记忆与知识系统',
    productType: 'Tools Memory Layer',
    tagline: 'AI 工具链的长期工作记忆',
    useCase: 'CLI 工具记忆 / 工作流复用 / 知识库',
    outcome: '把 AI 工具、CLI 命令和脚本经验保存成跨会话可检索的工作记忆。',
    launchRank: '#4',
    upvotes: 'New',
    previewType: 'tools',
    highlights: ['CLI 经验沉淀', '工具知识库', '可检索工作流'],
    description:
      '面向 AI 工具、CLI 工作流和可复用脚本的跨会话记忆层，沉淀工具使用经验。',
    url: 'https://github.com/yizhiyanhua-ai/fireworks-ai-tools-memory',
    demo: 'https://yizhiyanhua-ai.github.io/fireworks-ai-tools-memory/',
    stars: 0,
    forks: 0,
    language: 'HTML',
    tags: ['Automation', 'CLI', 'Knowledge base'],
    accent: 'gold',
  },
  {
    name: 'media-downloader',
    category: 'AI 内容生产',
    productType: 'Media Workflow AI',
    tagline: '内容生产前置素材引擎',
    useCase: '素材搜索 / 图片视频下载 / 内容创作',
    outcome: '用描述驱动素材收集，把内容生产前期的搜索、筛选和下载流程自动化。',
    launchRank: '#5',
    upvotes: '391',
    previewType: 'media',
    highlights: ['描述驱动搜索', '图片视频下载', '创作素材管线'],
    description:
      '根据描述自动搜索和下载图片、视频片段，服务内容创作、研究与视觉素材收集。',
    url: 'https://github.com/yizhiyanhua-ai/media-downloader',
    demo: null,
    stars: 391,
    forks: 43,
    language: 'Python',
    tags: ['Media', 'Search', 'Automation'],
    accent: 'orange',
  },
  {
    name: 'skills-updater',
    category: 'AI Agent 工作流',
    productType: 'Skill Registry',
    tagline: 'Agent 技能生态维护器',
    useCase: '技能发现 / 技能更新 / Agent 工具链维护',
    outcome: '让 Claude Code skills 具备可发现、可更新、可维护的生态入口。',
    launchRank: '#6',
    upvotes: '165',
    previewType: 'registry',
    highlights: ['技能发现', '批量更新', '工具链维护'],
    description:
      '管理、更新和发现 Claude Code skills，让社区工具链保持可维护、可迭代。',
    url: 'https://github.com/yizhiyanhua-ai/skills-updater',
    demo: null,
    stars: 165,
    forks: 15,
    language: 'Python',
    tags: ['Skills', 'Registry', 'Updater'],
    accent: 'blue',
  },
  {
    name: 'chuinb-skill',
    category: 'AI 学习与研究',
    productType: 'Industry Learning Agent',
    tagline: '陌生行业的速通研究助手',
    useCase: '行业速成 / 术语拆解 / 产业链研究',
    outcome: '把陌生行业拆成术语、产业链、关键玩家和行动路线，帮助实践者快速进入语境。',
    launchRank: '#7',
    upvotes: '92',
    previewType: 'research',
    highlights: ['术语拆解', '产业链地图', '行动路线'],
    description:
      '行业速成大师：把陌生行业拆成术语、产业链、关键玩家和行动路线。',
    url: 'https://github.com/yizhiyanhua-ai/chuinb-skill',
    demo: null,
    stars: 92,
    forks: 7,
    language: 'Shell',
    tags: ['Learning', 'Research', 'Claude Code'],
    accent: 'purple',
  },
  {
    name: 'youtube-ai-digest',
    category: 'AI 学习与研究',
    productType: 'Video Research Digest',
    tagline: '把 AI 长视频变成学习资产',
    useCase: 'AI 视频总结 / 学习材料沉淀 / 长内容处理',
    outcome: '把 AI 相关长视频转成结构化摘要和可复用学习材料，连接内容输入和知识沉淀。',
    launchRank: '#8',
    upvotes: '52',
    previewType: 'video',
    highlights: ['长视频摘要', '结构化笔记', '学习材料沉淀'],
    description:
      '浏览、总结并捕获 AI 相关 YouTube 视频，把长视频转成可复用的学习材料。',
    url: 'https://github.com/yizhiyanhua-ai/youtube-ai-digest',
    demo: null,
    stars: 52,
    forks: 6,
    language: 'Python',
    tags: ['YouTube', 'Digest', 'AI learning'],
    accent: 'green',
  },
];

export const operatingPrinciples = [
  {
    title: '开源开放',
    body: '优先沉淀可验证、可复用、可 Fork 的项目和方法，让社区成果可以被外部开发者继续使用。',
    tone: 'blue',
  },
  {
    title: '共建共治',
    body: '社区的价值来自真实使用者：提出问题、复盘过程、贡献脚本、修正文档、共同维护质量。',
    tone: 'orange',
  },
  {
    title: '质量优先',
    body: '重视证据、验证和可运行成果，少做口号，多交付能被别人接着用的资产。',
    tone: 'gold',
  },
  {
    title: '长期主义',
    body: '把一次性技巧升级成工具链、Skill、教程和开源项目，让个人学习曲线和社区资产持续复利。',
    tone: 'green',
  },
  {
    title: '安全合规',
    body: '官网只展示公开信息，不展示私密群内容、个人隐私、未授权联系方式或凭据。',
    tone: 'purple',
  },
];

export const rhythm = [
  {
    title: '每周共学',
    detail: '围绕新工具、新论文和工程案例做结构化拆解。',
  },
  {
    title: '论文精读',
    detail: '把关键概念、实验方法和可复现路径整理成社区材料。',
  },
  {
    title: '项目共创',
    detail: '围绕真实需求打磨 Skill、脚本、模板和演示站点。',
  },
  {
    title: '复盘沉淀',
    detail: '把过程、失败、验证结果写进文档和代码，而不只停留在讨论。',
  },
  {
    title: '成果展示',
    detail: '把可公开项目集中到 GitHub Pages 与开源仓库，方便更多人复用。',
  },
];
