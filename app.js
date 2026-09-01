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

// ポケモンスロットを作成（チェックボックス + タイププルダウン）
function createPokemonSlot(id) {
    const div = document.createElement('div');
    div.className = 'pokemon-slot';
    
    // チェックボックス（初期状態：チェック済み）
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id + '-check';
    checkbox.checked = true;
    checkbox.addEventListener('change', function() {
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
    
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'ポケモンを選択';
    pokemonSelect.appendChild(emptyOption);
    
    pokemonList.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon;
        option.textContent = pokemon;
        pokemonSelect.appendChild(option);
    });
    
    pokemonSelect.addEventListener('change', function() {
        updatePokemonTypes(id);
    });
    
    // タイプ1プルダウン（検索可能）
    const type1Container = document.createElement('div');
    type1Container.className = 'type-input-container';
    type1Container.id = id + '-type1-container';
    
    const type1Input = document.createElement('input');
    type1Input.type = 'text';
    type1Input.id = id + '-type1-search';
    type1Input.className = 'type-search-input';
    type1Input.placeholder = 'タイプ1';
    type1Input.autocomplete = 'off';
    
    const type1Dropdown = document.createElement('div');
    type1Dropdown.className = 'type-dropdown-list';
    type1Dropdown.id = id + '-type1-dropdown';
    
    createTypeDropdown(type1Input, type1Dropdown, id + '-type1');
    
    type1Container.appendChild(type1Input);
    type1Container.appendChild(type1Dropdown);
    
    // タイプ2プルダウン（検索可能）
    const type2Container = document.createElement('div');
    type2Container.className = 'type-input-container';
    type2Container.id = id + '-type2-container';
    
    const type2Input = document.createElement('input');
    type2Input.type = 'text';
    type2Input.id = id + '-type2-search';
    type2Input.className = 'type-search-input';
    type2Input.placeholder = 'タイプ2';
    type2Input.autocomplete = 'off';
    
    const type2Dropdown = document.createElement('div');
    type2Dropdown.className = 'type-dropdown-list';
    type2Dropdown.id = id + '-type2-dropdown';
    
    createTypeDropdown(type2Input, type2Dropdown, id + '-type2');
    
    type2Container.appendChild(type2Input);
    type2Container.appendChild(type2Dropdown);
    
    div.appendChild(checkbox);
    div.appendChild(pokemonSelect);
    div.appendChild(type1Container);
    div.appendChild(type2Container);
    
    return div;
}

// タイプドロップダウンを作成
function createTypeDropdown(input, dropdown, dataId) {
    input.addEventListener('focus', function() {
        showTypeDropdown(dropdown, input.value);
        dropdown.style.display = 'block';
    });
    
    input.addEventListener('input', function() {
        showTypeDropdown(dropdown, input.value);
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200);
    });
}

// タイプドロップダウンを表示
function showTypeDropdown(dropdown, searchText) {
    dropdown.innerHTML = '';
    
    const searchHiragana = toHiragana(searchText.toLowerCase());
    
    typeList.forEach(type => {
        const typeHiragana = toHiragana(type.jp.toLowerCase());
        
        // ひらがな検索に対応
        if (typeHiragana.includes(searchHiragana) || type.jp.includes(searchText)) {
            const item = document.createElement('div');
            item.className = 'type-dropdown-item';
            item.textContent = type.jp;
            
            item.addEventListener('click', function() {
                const input = dropdown.previousElementSibling;
                input.value = type.jp;
                input.dataset.type = type.en;
                dropdown.style.display = 'none';
            });
            
            dropdown.appendChild(item);
        }
    });
}

// ポケモン選択時にタイプを更新
function updatePokemonTypes(id) {
    const pokemonName = document.getElementById(id + '-pokemon').value;
    
    if (pokemonName && pokemonDatabase[pokemonName]) {
        const pokemonInfo = pokemonDatabase[pokemonName];
        const types = pokemonInfo.types;
        
        // タイプ1を設定
        const type1Input = document.getElementById(id + '-type1-search');
        type1Input.value = getTypeNameJP(types[0]);
        type1Input.dataset.type = types[0];
        
        // タイプ2を設定（あれば）
        const type2Input = document.getElementById(id + '-type2-search');
        if (types[1]) {
            type2Input.value = getTypeNameJP(types[1]);
            type2Input.dataset.type = types[1];
        } else {
            type2Input.value = '';
            type2Input.dataset.type = '';
        }
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
    if (myParty.length === 0) {
        showResult('<div class="warning">⚠️ 最低1匹以上ポケモン（または\タイプ）を入力してください</div>');
        return;
    }
    
    // 分析を実行
    const myAnalysis = analyzeOwnPartyWeakness(myParty);
    const enemyAnalysis = enemyParty.length > 0 ? analyzeOwnPartyWeakness(enemyParty) : null;
    
    // 結果を表示
    displayAnalysisResult(myAnalysis, myParty, enemyAnalysis, enemyParty);
}

// パーティデータを取得（チェックボックスがONのもの）
function getPartyData(prefix) {
    const party = [];
    
    for (let i = 0; i < 6; i++) {
        const checkbox = document.getElementById(`${prefix}${i}-check`);
        const pokemonName = document.getElementById(`${prefix}${i}-pokemon`).value.trim();
        const type1 = document.getElementById(`${prefix}${i}-type1-search`).dataset.type || '';
        const type2 = document.getElementById(`${prefix}${i}-type2-search`).dataset.type || '';
        
        if (!checkbox.checked) continue;
        
        // ポケモンが選択されていればそれを使用、なければタイプから判定
        if (pokemonName && pokemonDatabase[pokemonName]) {
            const pokemonInfo = pokemonDatabase[pokemonName];
            party.push({
                name: pokemonName,
                types: pokemonInfo.types
            });
        } else if (type1) {
            // ポケモン未選択でもタイプがあれば使用
            const types = [type1];
            if (type2 && type2 !== type1) {
                types.push(type2);
            }
            party.push({
                name: `(${types.map(t => getTypeNameJP(t)).join('/')})`,
                types: types
            });
        }
    }
    
    return party;
}

// 自分のパーティの弱点の一貫性を分析
function analyzeOwnPartyWeakness(party) {
    const analysis = {
        typeWeakness: {},
        typeStatus: {}
    };

    // パーティの「実際のポケモン」ごとに弱点を調べる
    party.forEach(pokemon => {
        pokemon.types.forEach(defType => {
            if (!analysis.typeWeakness[defType]) {
                analysis.typeWeakness[defType] = {
                    type: defType,
                    weakness: []
                };
            }
        });
    });

    // 全18タイプの攻撃について調べる
    Object.keys(typeChart).forEach(attackType => {

        // この攻撃タイプに対して、
        // パーティ内に「0.5倍以下」で受けられるポケモンがいるか
        const canResist = party.some(pokemon => {
            const multiplier = getTypeMultiplier(
                attackType,
                pokemon.types
            );

            return multiplier <= 0.5;
        });

        // パーティ内に「2倍以上」で受けるポケモンがいるか
        const hasWeakness = party.some(pokemon => {
            const multiplier = getTypeMultiplier(
                attackType,
                pokemon.types
            );

            return multiplier >= 2;
        });

        // 全員が等倍かどうか
        const allNeutral = party.length > 0 && party.every(pokemon => {
            return getTypeMultiplier(attackType, pokemon.types) === 1;
        });

        analysis.typeStatus[attackType] = {
            type: attackType,
            isConsistent: (hasWeakness || allNeutral) && !canResist,
            consistencyType: allNeutral ? 'neutral' : 'weakness'
        };
    });

    // タイプごとの弱点を作成
    Object.keys(typeChart).forEach(defType => {
        const weakness = [];

        Object.keys(typeChart).forEach(attackType => {
            const multiplier = getTypeMultiplier(
                attackType,
                [defType]
            );

            if (multiplier >= 2) {
                weakness.push(attackType);
            }
        });

        if (weakness.length > 0) {
            analysis.typeWeakness[defType] = {
                type: defType,
                weakness: weakness
            };
        }
    });

    return analysis;
}


// 攻撃タイプ → 防御側の複合タイプの最終倍率を計算
function getTypeMultiplier(attackType, defenseTypes) {
    let multiplier = 1;

    defenseTypes.forEach(defenseType => {

        const attackData = typeChart[attackType];

        if (!attackData) return;

        // 無効
        if (attackData.noEffect.includes(defenseType)) {
            multiplier *= 0;
        }
        // 半減
        else if (attackData.notVeryEffective.includes(defenseType)) {
            multiplier *= 0.5;
        }
        // 弱点
        else if (attackData.superEffective.includes(defenseType)) {
            multiplier *= 2;
        }
    });

    return multiplier;
}

// 分析結果を表示
function displayAnalysisResult(myAnalysis, myParty, enemyAnalysis, enemyParty) {
    let html = '<div class="result-title">📊 パーティ弱点分析結果</div>';
    
    // 自分のパーティ表示
    html += '<div class="result-section">';
    html += '<h4>👤 自分のパーティ</h4>';
    html += '<div class="result-content">';
    myParty.forEach(p => {
        const typeStr = p.types.map(t => getTypeNameJP(t)).join('/');
        html += `<div>• ${p.name} (${typeStr})</div>`;
    });
    html += '</div></div>';
    
    // 自分のパーティの弱点分析
    html += displayTypeWeaknessTable('自分', myAnalysis);
    
    // 相手のパーティ表示
    if (enemyParty.length > 0) {
        html += '<div class="result-section">';
        html += '<h4>🎯 相手のパーティ</h4>';
        html += '<div class="result-content">';
        enemyParty.forEach(p => {
            const typeStr = p.types.map(t => getTypeNameJP(t)).join('/');
            html += `<div>• ${p.name} (${typeStr})</div>`;
        });
        html += '</div></div>';
        
        // 相手のパーティの弱点分析
        html += displayTypeWeaknessTable('相手', enemyAnalysis);
    }
    
    showResult(html);
}

// タイプ弱点テーブルを表示
function displayTypeWeaknessTable(label, analysis) {
    let html = '<div class="result-section">';
    html += `<h4>🛡️ ${label}のパーティの一貫タイプ</h4>`;

    const consistentTypes = Object.keys(analysis.typeStatus).filter(type => {
        return analysis.typeStatus[type].isConsistent;
    });

    if (consistentTypes.length === 0) {
        html += '<div class="success">✅ 一貫しているタイプはありません</div>';
    } else {
        html += '<table class="type-table">';
        html += '<thead><tr>';
        html += '<th>攻撃タイプ</th>';
        html += '<th>一貫の種類</th>';
        html += '</tr></thead>';
        html += '<tbody>';

        consistentTypes.forEach(type => {
            const status = analysis.typeStatus[type].consistencyType;

            html += '<tr>';
            html += `<td class="type-name">${getTypeNameJP(type)}</td>`;

            if (status === 'neutral') {
                html += '<td>🟠 等倍一貫</td>';
            } else {
                html += '<td>🔴 弱点一貫</td>';
            }

            html += '</tr>';
        });

        html += '</tbody>';
        html += '</table>';
    }

    html += '</div>';

    return html;
}

// 結果を表示する
function showResult(html) {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    
    // スムーズにスクロール
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
