// ポケモンデータベース
const pokemonDatabase = {
    'ガブリアス': { jp: 'ガブリアス', types: ['ground', 'dragon'] },
    'アシレーヌ': { jp: 'アシレーヌ', types: ['water', 'fairy'] },
    'マスカーニャ': { jp: 'マスカーニャ', types: ['grass', 'dark'] },
    'ブリジュラス': { jp: 'ブリジュラス', types: ['steel', 'dragon'] },
    'ミミッキュ': { jp: 'ミミッキュ', types: ['ghost', 'fairy'] },
    'カバルドン': { jp: 'カバルドン', types: ['ground'] }
};

// ポケモンリスト
const pokemonList = Object.keys(pokemonDatabase);