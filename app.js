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

// ポケモンスロットを作成（チェックボックス + プルダウン）
function createPokemonSlot(id) {
    const div = document.createElement('div');
    div.className = 'pokemon-slot';
    
    // チェックボックス（初期状態：チェック済み）
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id + '-check';
    checkbox.checked = true;
    checkbox.addEventListener('change', function() {
        // チェックボックスの状態に応じてスロットのスタイルを変更
        if (!checkbox.checked) {
            div.classList.add('disabled');
        } else {
            div.classList.remove('disabled');
        }
    });
    
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
    
    div.appendChild(checkbox);
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

// パーティデータを取得（チェックボックスがONのもののみ）
function getPartyData(prefix) {
    const party = [];
    
    for (let i = 0; i < 6; i++) {
        const checkbox = document.getElementById(`${prefix}${i}-check`);
        const pokemonName = document.getElementById(`${prefix}${i}-pokemon`).value.trim();
        
        // チェックボックスがONかつポケモンが選択されている場合のみ追加
        if (checkbox.checked && pokemonName && pokemonDatabase[pokemonName]) {
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
        typeStatus: {}         // 各タイプの状態
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
    
    // 各タイプの状態を初期化
    enemyTypes.forEach(type => {
        analysis.typeStatus[type] = {
            type: type,
            isConsistent: true,  // 初期状態：一貫している
            superEffective: [],  // 抜群を受けるタイプ
            resistance: []       // 半減以下を受けるタイプ
        };
    });
    
    // 相手の各攻撃タイプについて、自分のパーティがどう対応しているか確認
    enemyTypes.forEach(attackType => {
        const canResist = myParty.some(pokemon => {
            return pokemon.types.some(defType => {
                const def = defenseChart[defType];
                if (!def) return false;
                
                // 無効 > 耐性 > 等倍
                if (def.immunity.includes(attackType)) return true;
                if (def.resistance.includes(attackType)) return true;
                return false;
            });
        });
        
        if (canResist) {
            // 誰かが対応できる → 一貫していない
            analysis.typeStatus[attackType].isConsistent = false;
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
    
    // 各タイプの抜群と半減を計算
    enemyTypes.forEach(attackType => {
        const attack = typeChart[attackType];
        
        // 抜群（このタイプで弱点になる）
        myParty.forEach(pokemon => {
            pokemon.types.forEach(defType => {
                if (defenseChart[defType] && defenseChart[defType].weakness.includes(attackType)) {
                    if (!analysis.typeStatus[attackType].superEffective.includes(defType)) {
                        analysis.typeStatus[attackType].superEffective.push(defType);
                    }
                }
            });
        });
        
        // 半減以下（このタイプで耐性・無効になる）
        myParty.forEach(pokemon => {
            pokemon.types.forEach(defType => {
                const def = defenseChart[defType];
                if (def) {
                    if (def.resistance.includes(attackType) || def.immunity.includes(attackType)) {
                        if (!analysis.typeStatus[attackType].resistance.includes(defType)) {
                            analysis.typeStatus[attackType].resistance.push(defType);
                        }
                    }
                }
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
    
    // タイプ相性表（一貫しているタイプを上に）
    html += '<div class="result-section">';
    html += '<h4>⚔️ タイプ相性一覧</h4>';
    
    // タイプを一貫性でソート（一貫している = true を上に）
    const sortedTypes = Object.values(analysis.typeStatus).sort((a, b) => {
        if (a.isConsistent !== b.isConsistent) {
            return b.isConsistent - a.isConsistent;  // true が上に来る
        }
        return 0;
    });
    
    if (sortedTypes.length === 0) {
        html += '<div class="success">✅ 相手に一貫タイプがありません！</div>';
    } else {
        html += '<table class="type-table">';
        html += '<thead><tr>';
        html += '<th>タイプ</th>';
        html += '<th>状態</th>';
        html += '<th>抜群（弱点）</th>';
        html += '<th>半減以下（耐性）</th>';
        html += '</tr></thead>';
        html += '<tbody>';
        
        sortedTypes.forEach(typeInfo => {
            const rowClass = typeInfo.isConsistent ? 'consistent' : '';
            const statusText = typeInfo.isConsistent ? '🚨 一貫' : '✅ 対応';
            const statusClass = typeInfo.isConsistent ? 'super-effective' : 'resistance';
            const superEffectiveTypes = typeInfo.superEffective.map(t => getTypeNameJP(t)).join(', ') || 'なし';
            const resistanceTypes = typeInfo.resistance.map(t => getTypeNameJP(t)).join(', ') || 'なし';
            
            html += `<tr class="${rowClass}">`;
            html += `<td class="type-name">${getTypeNameJP(typeInfo.type)}</td>`;
            html += `<td class="${statusClass}"><strong>${statusText}</strong></td>`;
            html += `<td>${superEffectiveTypes}</td>`;
            html += `<td>${resistanceTypes}</td>`;
            html += `</tr>`;
        });
        
        html += '</tbody>';
        html += '</table>';
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
