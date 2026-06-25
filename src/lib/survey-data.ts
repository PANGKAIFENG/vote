import type {
  AgentDefinition,
  AgentId,
  CustomerTypeOption,
  RatingField,
  RoleOption
} from "./survey-types";

export const AGENT_IDS = [
  "email_outreach",
  "marketing_acquisition",
  "customer_development",
  "trend_analysis",
  "style_asset_governance"
] as const;

export const RATING_FIELDS: RatingField[] = [
  {
    key: "purchaseOrUpsell",
    label: "成单 / 增购帮助",
    question: "如果这个 Agent 做出来，是否有助于客户购买高级版或增购？"
  },
  {
    key: "pain",
    label: "客户痛点强度",
    question: "ODM 客户现在是否真的在这个环节有明显痛点？"
  },
  {
    key: "coverage",
    label: "适用客户范围",
    question: "你接触的 ODM 客户里，有多少客户会需要这个能力？"
  },
  {
    key: "frequency",
    label: "使用频次",
    question: "客户会不会经常使用，而不是偶尔用一次？"
  },
  {
    key: "resultUsability",
    label: "结果可用性",
    question: "它输出的内容，客户是否能直接拿去工作或对外使用？"
  }
];

export const RATING_SCALE = [
  "基本没价值",
  "有一点价值，但不是刚需",
  "有明确价值，部分客户会需要",
  "价值较强，很多客户会感兴趣",
  "非常有价值，可能直接影响购买或增购"
];

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "sales", label: "销售" },
  { value: "solution", label: "解决方案" },
  { value: "customer_success", label: "客户成功" },
  { value: "business_owner", label: "业务负责人" },
  { value: "product_ops", label: "产品运营" },
  { value: "other", label: "其他" }
];

export const CUSTOMER_TYPE_OPTIONS: CustomerTypeOption[] = [
  { value: "large_odm", label: "大型 ODM" },
  { value: "small_mid_odm", label: "中小 ODM" },
  { value: "export_odm", label: "外贸 ODM" },
  { value: "design_odm", label: "设计型 ODM" },
  { value: "other", label: "其他" }
];

export const AGENTS: Record<AgentId, AgentDefinition> = {
  email_outreach: {
    id: "email_outreach",
    name: "邮件拓新 Agent",
    shortName: "邮件拓新",
    tagline: "从海量线索池中找到潜在客户，并批量生成个性化开发邮件和跟进内容。",
    scene: "销售主动开发新客户；展会前后导入采购商名单；外贸 ODM 批量触达潜在客户。",
    workflow: [
      "导入客户线索池 / 展会采购商名单 / 目标市场",
      "多维筛选潜在客户",
      "生成不同角色的个性化开发邮件",
      "自动或半自动发送与跟进",
      "汇总客户回复与兴趣点"
    ],
    keywords: ["主动找客户", "邮件触达", "客户线索", "跟进建议"]
  },
  marketing_acquisition: {
    id: "marketing_acquisition",
    name: "营销获客 Agent",
    shortName: "营销获客",
    tagline: "面向不同渠道一键生成获客素材，让 ODM 的能力、案例和款式更容易被客户看见。",
    scene: "小红书、LinkedIn、官网、展会、朋友圈、邮件等多渠道内容准备。",
    workflow: [
      "输入公司能力 / 案例 / 主推款 / 面料 / 展会主题",
      "选择渠道：小红书 / LinkedIn / 官网 / 展会 / 朋友圈",
      "自动适配渠道尺寸、文案风格和内容格式",
      "一键生成多渠道素材",
      "可选：辅助发布、排期、内容日历"
    ],
    keywords: ["多渠道展示", "获客素材", "一键适配", "内容日历"]
  },
  customer_development: {
    id: "customer_development",
    name: "客户开发 Agent",
    shortName: "客户开发",
    tagline: "针对明确客户做深度分析，并生成客户分析卡、开发理由和定向推送内容。",
    scene: "客户主动找来后；销售锁定某个目标客户后；拜访客户前；首轮推送前。",
    workflow: [
      "输入客户官网 / 品牌资料 / 社媒 / 目标市场 / 历史沟通",
      "分析客户品类、风格、价格带、上新节奏和渠道",
      "生成客户分析卡",
      "给出开发理由和切入点",
      "生成定向推送内容或首轮推荐方向"
    ],
    keywords: ["客户分析", "精准开发", "定向推送", "拜访准备"]
  },
  trend_analysis: {
    id: "trend_analysis",
    name: "趋势分析 Agent",
    shortName: "趋势分析",
    tagline: "连接 Instagram、Pinterest、小红书等趋势平台，分析当季款式方向，支撑开发新款和推款。",
    scene: "设计新款前；准备推款前；展会选题前；客户需要趋势证据时。",
    workflow: [
      "输入季节 / 品类 / 目标客户 / 市场方向",
      "连接 Instagram / Pinterest / 小红书 / 趋势资料",
      "收集参考图和趋势信号",
      "分析廓形、面料、色彩、图案、工艺、搭配",
      "生成趋势分析卡，可进一步生成款式图、搭配图或推款方向"
    ],
    keywords: ["趋势判断", "参考图", "廓形色彩面料工艺", "开发方向"]
  },
  style_asset_governance: {
    id: "style_asset_governance",
    name: "款式资产治理 Agent",
    shortName: "资产治理",
    tagline: "利用 Desktop 能力整理本地款式库，完成相似款归类、字段补全、图片治理和入库确认。",
    scene: "客户本地款式图片混乱；历史款难检索；需要把本地资产上传到款式库；推款前需要盘活历史款。",
    workflow: [
      "选择本地款式文件夹",
      "桌面端扫描图片和文件",
      "相似款归类，清理重复图 / 低质图",
      "上传到款式库并字段补全",
      "自动入库或人工确认"
    ],
    keywords: ["本地款式库", "相似款归类", "字段补全", "图片治理", "入库确认"]
  }
};

export const DIRECTION_STAGES = [
  {
    title: "前续增长与准备",
    status: "待开发 / 本次重点调研",
    tone: "blue",
    description: "不强依赖资产库，先提升获客与开发效率",
    items: [
      "邮件拓新 Agent",
      "营销获客 Agent",
      "客户开发 Agent",
      "趋势分析 Agent",
      "款式资产治理 Agent"
    ]
  },
  {
    title: "当前推款样板",
    status: "已在建设",
    tone: "green",
    description: "ODM 推款 Agent",
    items: ["检索优化", "推荐优化", "PPT 交付优化", "趋势证据优化"]
  },
  {
    title: "后续业务系统连通",
    status: "第二优先级 / 中期方向",
    tone: "amber",
    description: "连接真实业务系统和客户项目流转",
    items: ["开发报价 Agent", "复盘增长 Agent", "ERP / 款式库连接", "客户项目工作台", "反馈与偏好沉淀"]
  }
];

export function isAgentId(value: string): value is AgentId {
  return (AGENT_IDS as readonly string[]).includes(value);
}
