// ポケモンデータベース
const pokemonDatabase = {
    'ガブリアス': { jp: 'ガブリアス', types: ['ground', 'dragon'] },
    'アシレーヌ': { jp: 'アシレーヌ', types: ['water', 'fairy'] },
    'マスカーニャ': { jp: 'マスカーニャ', types: ['grass', 'dark'] },
    'ブリジュラス': { jp: 'ブリジュラス', types: ['steel', 'dragon'] },
    'ミミッキュ': { jp: 'ミミッキュ', types: ['ghost', 'fairy'] },
    'カバルドン': { jp: 'カバルドン', types: ['ground'] },
    'ハッサム': { jp: 'ハッサム', types: ['steel','insect'] },
    'ギャラドス': { jp: 'ギャラドス', types: ['water', 'flying'] },
    'マフォクシー': { jp: 'マフォクシー', types: ['fire', 'psychic'] },
    'カイリュー': { jp: 'カイリュー', types: ['dragon', 'flying'] },
    'メタグロス': { jp: 'メタグロス', types: ['steel', 'psychic'] },
    'リザードン': { jp: 'リザードン', types: ['fire', 'flying'] },
    'イダイトウ（オス）': { jp: 'イダイトウ（オス）', types: ['water', 'ghost'] },
    'アーマーガア': { jp: 'アーマーガア', types: ['flying', 'steel'] },
    'サザンドラ': { jp: 'サザンドラ', types: ['dark', 'dragon'] },
    'ライチュウ': { jp: 'ライチュウ', types: ['electric'] },
    'キラフロル': { jp: 'キラフロル', types: ['rock', 'poison'] },
    'ゲンガー': { jp: 'ゲンガー', types: ['ghost', 'poison'] },
    'ゲッコウガ': { jp: 'ゲッコウガ', types: ['water', 'dark'] },
    'ウルガモス': { jp: 'ウルガモス', types: ['bug', 'fire'] },
    'ドドゲザン': { jp: 'ドドゲザン', types: ['dark', 'steel'] },
    'バシャーモ': { jp: 'バシャーモ', types: ['fire', 'fighting'] },
    'サーフゴー': { jp: 'サーフゴー', types: ['steel', 'ghost'] },
    'ギルガルド': { jp: 'ギルガルド', types: ['steel', 'ghost'] },
    'ダイケンキ（ヒスイ）': { jp: 'ダイケンキ（ヒスイ）', types: ['water', 'dark'] },
    'ブラッキー': { jp: 'ブラッキー', types: ['dark'] },
    'ニンフィア': { jp: 'ニンフィア', types: ['fairy'] },
    'ムクホーク': { jp: 'ムクホーク', types: ['normal', 'flying'] },
    'ルカリオ': { jp: 'ルカリオ', types: ['fighting', 'steel'] },
    'ウォッシュロトム': { jp: 'ウォッシュロトム', types: ['electric', 'water'] },
    'ミミロップ': { jp: 'ミミロップ', types: ['normal'] },
    'フシギバナ': { jp: 'フシギバナ', types: ['grass', 'poison'] },
    'キュウコン（アローラ）': { jp: 'キュウコン（アローラ）', types: ['ice', 'fairy'] },
    'ラウドボーン': { jp: 'ラウドボーン', types: ['fire', 'ghost'] },
    'スターミー': { jp: 'スターミー', types: ['water', 'psychic'] },
    'ハラバリー': { jp: 'ハラバリー', types: ['electric'] },
    'ドヒドイデ': { jp: 'ドヒドイデ', types: ['poison', 'water'] },
    'ドラパルト': { jp: 'ドラパルト', types: ['dragon', 'ghost'] },
    'ラグラージ': { jp: 'ラグラージ', types: ['water', 'ground'] },
    'スコヴィラン': { jp: 'スコヴィラン', types: ['grass', 'fire'] }
};

// ポケモンリスト
const pokemonList = Object.keys(pokemonDatabase);

// タイプリスト（ひらがなのみ）
const typeList = [
    { jp: 'ノーマル', en: 'normal' },
    { jp: 'ほのお', en: 'fire' },
    { jp: 'みず', en: 'water' },
    { jp: 'でんき', en: 'electric' },
    { jp: 'くさ', en: 'grass' },
    { jp: 'こおり', en: 'ice' },
    { jp: 'かくとう', en: 'fighting' },
    { jp: 'どく', en: 'poison' },
    { jp: 'じめん', en: 'ground' },
    { jp: 'ひこう', en: 'flying' },
    { jp: 'エスパー', en: 'psychic' },
    { jp: 'むし', en: 'insect' },
    { jp: 'いわ', en: 'rock' },
    { jp: 'ゴースト', en: 'ghost' },
    { jp: 'ドラゴン', en: 'dragon' },
    { jp: 'あく', en: 'dark' },
    { jp: 'はがね', en: 'steel' },
    { jp: 'フェアリー', en: 'fairy' }
];

// カタカナをひらがなに変換する関数
function toHiragana(text) {
    const katakanaMap = {
        'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
        'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
        'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
        'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
        'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
        'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
        'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
        'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
        'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',
        'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',
        'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
        'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
        'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
        'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',
        'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お'
    };
    
    let result = '';
    for (let char of text) {
        result += katakanaMap[char] || char;
    }
    return result;
}
