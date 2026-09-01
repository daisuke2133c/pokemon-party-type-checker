// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了');
    
    // パーティスロットを初期化
    initializePartySlots();
    
    // ボタンのイベントリスナーを設定
    document.getElementById('analyzeBtn').addEventListener('click', analyzeParty);
});

// パーティスロットを初期化（6匹分）
function initializePartySlots() {
    console.log('パーティスロット初期化中...');
    
    const myPartyDiv = document.getElementById('myParty');
    const enemyPartyDiv = document.getElementById('enemyParty');
    
    // 自分のパーティ：6匹分
    for (let i = 0; i < 6; i++) {
        myPartyDiv.appendChild(createPokemonSlot(`myPokemon${i}`));
    }
    
    // 相手のパーティ：6匹分
    for (let i = 0; i < 6; i++) {
        enemyPartyDiv.appendChild(createPokemonSlot(`enemyPokemon${i}`));
    }
    
    console.log('パーティスロット作成完了');
}

// ポケモンスロットを作成（プルダウン式）
function createPokemonSlot(id) {
    const div = document.createElement('div');
    div.className = 'pokemon-slot';
    
    // ポケモン名プルダウン
    const pokemonSelect = document.createElement('select');
    pokemonSelect.id = id + '-pokemon';
    pokemonSelect.className = 'pokemon-dropdown';
    
    // 空の選択肢
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'ポケモンを選択';
    pokemonSelect.appendChild(emptyOption);
    
    // ポケモンリストを追加
    pokemonList.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon;
        option.textContent = pokemon;
        pokemonSelect.appendChild(option);
    });
    
    // ポケモン選択時にタイプを自動表示
    pokemonSelect.addEventListener('change', function() {
        updatePokemonTypes(id);
    });
    
    // タイプ表示欄
    const typesDiv = document.createElement('div');
    typesDiv.className = 'types';
    typesDiv.id = id + '-types';
    
    // 初期表示：空
    const emptyBadge = document.createElement('span');
    emptyBadge.className = 'type-badge empty';
    emptyBadge.textContent = '---';
    typesDiv.appendChild(emptyBadge);
    
    div.appendChild(pokemonSelect);
    div.appendChild(typesDiv);
    
    return div;
}

// ポケモン選択時にタイプを更新
function updatePokemonTypes(id) {
    const pokemonSelect = document.getElementById(id + '-pokemon');
    const pokemonName = pokemonSelect.value;
    const typesDiv = document.getElementById(id + '-types');
    
    console.log(`ポケモン選択: ${id} = "${pokemonName}"`);
    
    // タイプバッジをクリア
    typesDiv.innerHTML = '';
    
    if (pokemonName && pokemonDatabase[pokemonName]) {
        const pokemonInfo = pokemonDatabase[pokemonName];
        const types = pokemonInfo.types;
        
        console.log(`タイプ: ${pokemonName} -> ${types.join(', ')}`);
        
        types.forEach(type => {
            const badge = document.createElement('span');
            badge.className = 'type-badge';
            badge.textContent = getTypeNameJP(type);
            typesDiv.appendChild(badge);
        });
    } else {
        // ポケモンが選択されていない場合は空のバッジを表示
        const emptyBadge = document.createElement('span');
        emptyBadge.className = 'type-badge empty';
        emptyBadge.textContent = '---';
        typesDiv.appendChild(emptyBadge);
    }
}

// パーティを分析
function analyzeParty() {
    console.log('パーティ分析開始');
    
    const myParty = getPartyData('myPokemon');
    const enemyParty = getPartyData('enemyPokemon');
    
    console.log('自分のパーティ:', myParty);
    console.log('相手のパーティ:', enemyParty);
    
    // 入力チェック
    if (myParty.length === 0 || enemyParty.length === 0) {
        showResult('<div class="warning">⚠️ 自分と相手の両方に最低1匹以上ポケモンを選択してください</div>');
        return;
    }
    
    // 分析を実行
    const analysis = analyzeTypeMatchups(myParty, enemyParty);
    
    // 結果を表示
    displayAnalysisResult(analysis, myParty, enemyParty);
}

// パーティデータを取得
function getPartyData(prefix) {
    const party = [];
    
    for (let i = 0; i < 6; i++) {
        const pokemonName = document.getElementById(`${prefix}${i}-pokemon`).value.trim();
        
        if (pokemonName && pokemonDatabase[pokemonName]) {
            const pokemonInfo = pokemonDatabase[pokemonName];
            party.push({
                name: pokemonName,
                types: pokemonInfo.types
            });
        }
    }
    
    return party;
}

// タイプマッチアップを分析
function analyzeTypeMatchups(myParty, enemyParty) {
    const analysis = {
        myWeaknesses: {},      // 自分の弱点
        consistent: []         // 相手の一貫タイプ
    };
    
    // 相手の全タイプを集める
    const enemyTypes = new Set();
    enemyParty.forEach(pokemon => {
        pokemon.types.forEach(type => {
            if (typeChart[type]) {
                enemyTypes.add(type);
            }
        });
    });
    
    // 相手の各攻撃タイプについて、自分のパーティがどう対応しているか確認
    enemyTypes.forEach(attackType => {
        const canResist = myParty.some(pokemon => {
            return pokemon.types.some(defType => {
                // 弱点、耐性、無効をチェック
                const def = defenseChart[defType];
                if (!def) return false;
                
                // 無効 > 耐性 > 等倍
                if (def.immunity.includes(attackType)) return true;  // 無効
                if (def.resistance.includes(attackType)) return true; // 耐性
                return false;
            });
        });
        
        if (!canResist) {
            // 誰も対応できない → 一貫している
            analysis.consistent.push(attackType);
        }
    });
    
    // 自分の各タイプの弱点を計算
    myParty.forEach(pokemon => {
        pokemon.types.forEach(defType => {
            const def = defenseChart[defType];
            if (!def) return;
            
            // この防御タイプの弱点
            def.weakness.forEach(attackType => {
                if (!analysis.myWeaknesses[attackType]) {
                    analysis.myWeaknesses[attackType] = [];
                }
                analysis.myWeaknesses[attackType].push(defType);
            });
        });
    });
    
    return analysis;
}

// 分析結果を表示
function displayAnalysisResult(analysis, myParty, enemyParty) {
    let html = '<div class="result-title">📊 パーティ分析結果</div>';
    
    // 自分のパーティ表示
    html += '<div class="result-section">';
    html += '<h4>👤 自分のパーティ</h4>';
    html += '<div class="result-content">';
    myParty.forEach(p => {
        const typeStr = p.types.map(t => getTypeNameJP(t)).join('／');
        html += `<div>• ${p.name} (${typeStr})</div>`;
    });
    html += '</div></div>';
    
    // 相手のパーティ表示
    html += '<div class="result-section">';
    html += '<h4>🎯 相手のパーティ</h4>';
    html += '<div class="result-content">';
    enemyParty.forEach(p => {
        const typeStr = p.types.map(t => getTypeNameJP(t)).join('／');
        html += `<div>• ${p.name} (${typeStr})</div>`;
    });
    html += '</div></div>';
    
    // 一貫性の分析
    html += '<div class="result-section">';
    html += '<h4>⚔️ 相手の一貫タイプ（自分が対応できない攻撃）</h4>';
    
    if (analysis.consistent.length === 0) {
        html += '<div class="success">✅ 相手に一貫タイプがありません！全てのタイプに対応できています。</div>';
    } else {
        html += '<div class="warning">⚠️ 以下のタイプは、自分のパーティで対応できるポケモンがいません：</div>';
        html += '<div class="type-list">';
        analysis.consistent.forEach(type => {
            html += `<span class="type-result-badge weak">${getTypeNameJP(type)}</span>`;
        });
        html += '</div>';
    }
    html += '</div>';
    
    // 自分の弱点分析
    html += '<div class="result-section">';
    html += '<h4>🛡️ 自分のパーティの弱点</h4>';
    html += '<div class="result-content">';
    
    const weaknessTypes = Object.keys(analysis.myWeaknesses).sort();
    if (weaknessTypes.length === 0) {
        html += '<div style="color: green; font-weight: bold;">弱点がありません！</div>';
    } else {
        weaknessTypes.forEach(weakType => {
            const affectedDefTypes = analysis.myWeaknesses[weakType];
            const uniqueDefTypes = [...new Set(affectedDefTypes)];
            html += `<div style="margin-bottom: 8px;">`;
            html += `<strong>${getTypeNameJP(weakType)}</strong> 攻撃が弱点：`;
            html += `${uniqueDefTypes.map(t => getTypeNameJP(t)).join(', ')}`;
            html += `</div>`;
        });
    }
    html += '</div></div>';
    
    showResult(html);
}

// 結果を表示する
function showResult(html) {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    
    // スムーズにスクロール
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
