// ポケモンタイプ相性チャート
const typeChart = {
    // 攻撃側：各タイプの攻撃が何に対して有効かを定義
    
    // ノーマルタイプの攻撃
    normal: {
        superEffective: [],
        notVeryEffective: ['rock', 'steel'],
        noEffect: ['ghost']
    },
    
    // 炎タイプの攻撃
    fire: {
        superEffective: ['grass', 'ice', 'bug', 'steel'],
        notVeryEffective: ['fire', 'water', 'rock', 'dragon'],
        noEffect: []
    },
    
    // 水タイプの攻撃
    water: {
        superEffective: ['fire', 'ground', 'rock'],
        notVeryEffective: ['water', 'grass', 'dragon'],
        noEffect: []
    },
    
    // 電気タイプの攻撃
    electric: {
        superEffective: ['water', 'flying'],
        notVeryEffective: ['electric', 'grass', 'dragon'],
        noEffect: ['ground']
    },
    
    // 草タイプの攻撃
    grass: {
        superEffective: ['water', 'ground', 'rock'],
        notVeryEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon'],
        noEffect: []
    },
    
    // 氷タイプの攻撃
    ice: {
        superEffective: ['flying', 'ground', 'grass', 'dragon'],
        notVeryEffective: ['fire', 'water', 'ice', 'steel'],
        noEffect: []
    },
    
    // 格闘タイプの攻撃
    fighting: {
        superEffective: ['normal', 'ice', 'rock', 'dark', 'steel'],
        notVeryEffective: ['flying', 'poison', 'bug', 'psychic', 'fairy'],
        noEffect: ['ghost']
    },
    
    // 毒タイプの攻撃
    poison: {
        superEffective: ['grass', 'fairy'],
        notVeryEffective: ['poison', 'ground', 'rock', 'ghost'],
        noEffect: ['steel']
    },
    
    // 地面タイプの攻撃
    ground: {
        superEffective: ['fire', 'electric', 'poison', 'rock', 'steel'],
        notVeryEffective: ['grass', 'bug'],
        noEffect: ['flying']
    },
    
    // 飛行タイプの攻撃
    flying: {
        superEffective: ['fighting', 'bug', 'grass'],
        notVeryEffective: ['electric', 'rock', 'steel'],
        noEffect: []
    },
    
    // エスパータイプの攻撃
    psychic: {
        superEffective: ['fighting', 'poison'],
        notVeryEffective: ['psychic', 'steel'],
        noEffect: ['dark']
    },
    
    // むしタイプの攻撃
    insect: {
        superEffective: ['grass', 'psychic', 'dark'],
        notVeryEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        noEffect: []
    },
    
    // 岩タイプの攻撃
    rock: {
        superEffective: ['fire', 'ice', 'flying', 'insect'],
        notVeryEffective: ['fighting', 'ground', 'steel'],
        noEffect: []
    },
    
    // ゴーストタイプの攻撃
    ghost: {
        superEffective: ['psychic', 'ghost'],
        notVeryEffective: ['dark'],
        noEffect: ['normal']
    },
    
    // ドラゴンタイプの攻撃
    dragon: {
        superEffective: ['dragon'],
        notVeryEffective: ['steel'],
        noEffect: ['fairy']
    },
    
    // 悪タイプの攻撃
    dark: {
        superEffective: ['psychic', 'ghost'],
        notVeryEffective: ['fighting', 'dark', 'fairy'],
        noEffect: []
    },
    
    // 鋼タイプの攻撃
    steel: {
        superEffective: ['ice', 'rock', 'fairy'],
        notVeryEffective: ['fire', 'water', 'electric', 'steel'],
        noEffect: []
    },
    
    // 妖精タイプの攻撃
    fairy: {
        superEffective: ['fighting', 'dragon', 'dark'],
        notVeryEffective: ['poison', 'steel'],
        noEffect: []
    }
};

// 防御側の視点：各タイプがどのタイプの攻撃に弱いか
const defenseChart = generateDefenseChart();

function generateDefenseChart() {
    const defense = {};
    
    // すべてのタイプを初期化
    Object.keys(typeChart).forEach(type => {
        defense[type] = {
            weakness: [],      // 2倍ダメージを受ける
            resistance: [],    // 0.5倍ダメージ
            immunity: []       // 無効
        };
    });
    
    // typeChart から防御視点を構築
    Object.keys(typeChart).forEach(attackType => {
        const attack = typeChart[attackType];
        
        // 弱点を登録
        attack.superEffective.forEach(defType => {
            if (defense[defType]) {
                defense[defType].weakness.push(attackType);
            }
        });
        
        // 耐性を登録
        attack.notVeryEffective.forEach(defType => {
            if (defense[defType]) {
                defense[defType].resistance.push(attackType);
            }
        });
        
        // 無効を登録
        attack.noEffect.forEach(defType => {
            if (defense[defType]) {
                defense[defType].immunity.push(attackType);
            }
        });
    });
    
    return defense;
}

// タイプの日本語表記
const typeNameMap = {
    'normal': 'ノーマル',
    'fire': '炎',
    'water': '水',
    'electric': '電気',
    'grass': '草',
    'ice': '氷',
    'fighting': '格闘',
    'poison': '毒',
    'ground': '地面',
    'flying': '飛行',
    'psychic': 'エスパー',
    'insect': 'むし',
    'rock': '岩',
    'ghost': 'ゴースト',
    'dragon': 'ドラゴン',
    'dark': '悪',
    'steel': '鋼',
    'fairy': '妖精'
};

// タイプの英語から日本語に変換
function getTypeNameJP(englishType) {
    return typeNameMap[englishType] || englishType;
}
