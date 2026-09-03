// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了');
    initializePartySlots();
    document.getElementById('analyzeBtn').addEventListener('click', analyzeParty);
    document.getElementById('partyPageBtn').addEventListener('click', function() {
        showPage('party');
    });
    document.getElementById('attackPageBtn').addEventListener('click', function() {
        showPage('attack');
    });
    initializeAttackTypeChecker();
    document.getElementById('clearAttackBtn').addEventListener('click', clearAttackTypes);
    document.getElementById('checkAttackBtn').addEventListener('click', analyzeAttackTypeComplement);
});
// ページを切り替える
function showPage(page) {
    const partyPage = document.getElementById('partyPage');
    const attackPage = document.getElementById('attackPage');
    const partyPageBtn = document.getElementById('partyPageBtn');
    const attackPageBtn = document.getElementById('attackPageBtn');
    if (page === 'party') {
        partyPage.style.display = 'block';
        attackPage.style.display = 'none';
        partyPageBtn.classList.add('active');
        attackPageBtn.classList.remove('active');
    } else {
        partyPage.style.display = 'none';
        attackPage.style.display = 'block';
        partyPageBtn.classList.remove('active');
        attackPageBtn.classList.add('active');
    }
}
// パーティスロットを初期化
function initializePartySlots() {
    const myParty = document.getElementById('myParty');
    const enemyParty = document.getElementById('enemyParty');
    myParty.innerHTML = '';
    enemyParty.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        myParty.appendChild(createPokemonSlot('my', i));
        enemyParty.appendChild(createPokemonSlot('enemy', i));
    }
}
// ポケモンスロットを作成
function createPokemonSlot(prefix, index) {
    const slot = document.createElement('div');
    slot.className = 'pokemon-slot';
    slot.innerHTML = `
        <div class="slot-header">
            <span class="slot-number">${index + 1}</span>
            <span class="pokemon-name" id="${prefix}PokemonName${index}">未選択</span>
        </div>
        <div class="pokemon-input">
            <input type="text" id="${prefix}PokemonSearch${index}" placeholder="ポケモンを検索" autocomplete="off">
            <div class="dropdown" id="${prefix}PokemonDropdown${index}"></div>
        </div>
        <div class="type-inputs">
            <div class="type-input">
                <label>タイプ1</label>
                <select id="${prefix}Type1${index}">
                    <option value="">選択してください</option>
                </select>
            </div>
            <div class="type-input">
                <label>タイプ2</label>
                <select id="${prefix}Type2${index}">
                    <option value="">なし</option>
                </select>
            </div>
        </div>
    `;
    const type1Select = slot.querySelector(`#${prefix}Type1${index}`);
    const type2Select = slot.querySelector(`#${prefix}Type2${index}`);
    createTypeDropdown(type1Select);
    createTypeDropdown(type2Select);
    const searchInput = slot.querySelector(`#${prefix}PokemonSearch${index}`);
    searchInput.addEventListener('input', function() {
        showPokemonDropdown(prefix, index, this.value);
        updatePokemonTypesFromSearch(prefix, index, this.value);
    });
    return slot;
}
// タイプ選択欄を作成
function createTypeDropdown(select) {
    typeList.forEach(function(type) {
        const option = document.createElement('option');
        option.value = type.en;
        option.textContent = type.jp;
        select.appendChild(option);
    });
}
// ポケモン選択欄を表示
function createPokemonDropdown(prefix, index, pokemon) {
    const dropdown = document.getElementById(`${prefix}PokemonDropdown${index}`);
    const searchInput = document.getElementById(`${prefix}PokemonSearch${index}`);
    const pokemonName = document.getElementById(`${prefix}PokemonName${index}`);
    searchInput.value = pokemon.name;
    pokemonName.textContent = pokemon.name;
    dropdown.innerHTML = '';
    dropdown.classList.remove('show');
    const type1 = document.getElementById(`${prefix}Type1${index}`);
    const type2 = document.getElementById(`${prefix}Type2${index}`);
    type1.value = normalizeType(pokemon.types[0]);
    type2.value = pokemon.types[1] ? normalizeType(pokemon.types[1]) : '';
}
// ポケモン検索結果を表示
function showPokemonDropdown(prefix, index, searchTerm) {
    const dropdown = document.getElementById(`${prefix}PokemonDropdown${index}`);
    if (!searchTerm.trim()) {
        dropdown.innerHTML = '';
        dropdown.classList.remove('show');
        return;
    }
    const results = pokemonData.filter(function(pokemon) {
        return pokemon.name.includes(searchTerm.trim());
    });
    if (results.length === 0) {
        dropdown.innerHTML = '<div class="dropdown-item">見つかりません</div>';
        dropdown.classList.add('show');
        return;
    }
    dropdown.innerHTML = '';
    results.forEach(function(pokemon) {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = pokemon.name;
        item.addEventListener('click', function() {
            createPokemonDropdown(prefix, index, pokemon);
        });
        dropdown.appendChild(item);
    });
    dropdown.classList.add('show');
}
// 検索されたポケモンのタイプを更新
function updatePokemonTypesFromSearch(prefix, index, searchTerm) {
    const pokemon = pokemonData.find(function(pokemon) {
        return pokemon.name === searchTerm.trim();
    });
    if (!pokemon) {
        return;
    }
    const type1 = document.getElementById(`${prefix}Type1${index}`);
    const type2 = document.getElementById(`${prefix}Type2${index}`);
    type1.value = normalizeType(pokemon.types[0]);
    type2.value = pokemon.types[1] ? normalizeType(pokemon.types[1]) : '';
    const pokemonName = document.getElementById(`${prefix}PokemonName${index}`);
    pokemonName.textContent = pokemon.name;
}
// タイプ選択欄を表示
function showTypeDropdown(prefix, index) {
    const type1 = document.getElementById(`${prefix}Type1${index}`);
    const type2 = document.getElementById(`${prefix}Type2${index}`);
    type1.innerHTML = '<option value="">選択してください</option>';
    type2.innerHTML = '<option value="">なし</option>';
    createTypeDropdown(type1);
    createTypeDropdown(type2);
}
// タイプ名を正規化
function normalizeType(type) {
    return type === 'bug' ? 'insect' : type;
}
// タイプ配列を正規化
function normalizeTypes(types) {
    return types.map(normalizeType);
}
// パーティを分析
function analyzeParty() {
    const myParty = getPartyData('my');
    const enemyParty = getPartyData('enemy');
    const result = {
        myParty: analyzeOwnPartyWeakness(myParty),
        enemyParty: analyzeEnemyPartyWeakness(enemyParty),
        matchup: analyzeMatchup(myParty, enemyParty)
    };
    displayAnalysisResult(result);
}
// パーティデータを取得
function getPartyData(prefix) {
    const party = [];
    for (let i = 0; i < 6; i++) {
        const searchInput = document.getElementById(`${prefix}PokemonSearch${i}`);
        const type1 = document.getElementById(`${prefix}Type1${i}`).value;
        const type2 = document.getElementById(`${prefix}Type2${i}`).value;
        if (!searchInput.value.trim() && !type1) {
            continue;
        }
        const pokemonInfo = pokemonData.find(function(pokemon) {
            return pokemon.name === searchInput.value.trim();
        });
        const types = pokemonInfo ? normalizeTypes(pokemonInfo.types) : [type1, type2].filter(Boolean).map(normalizeType);
        party.push({
            name: searchInput.value.trim() || '未選択',
            types: types
        });
    }
    return party;
}
// 自分のパーティの弱点を分析
function analyzeOwnPartyWeakness(party) {
    const weaknesses = {};
    typeList.forEach(function(type) {
        const attackType = type.en;
        let canResist = false;
        let hasWeakness = false;
        let allNeutral = true;
        party.forEach(function(pokemon) {
            const multiplier = getTypeMultiplier(attackType, pokemon.types);
            if (multiplier <= 0.5) {
                canResist = true;
            }
            if (multiplier >= 2) {
                hasWeakness = true;
            }
            if (multiplier !== 1) {
                allNeutral = false;
            }
        });
        const isConsistent = (hasWeakness || allNeutral) && !canResist;
        weaknesses[attackType] = {
            canResist: canResist,
            hasWeakness: hasWeakness,
            allNeutral: allNeutral,
            isConsistent: isConsistent
        };
    });
    return weaknesses;
}
// 相手パーティの弱点を分析
function analyzeEnemyPartyWeakness(party) {
    const weaknesses = {};
    typeList.forEach(function(type) {
        const attackType = type.en;
        let count = 0;
        party.forEach(function(pokemon) {
            const multiplier = getTypeMultiplier(attackType, pokemon.types);
            if (multiplier >= 2) {
                count++;
            }
        });
        weaknesses[attackType] = count;
    });
    return weaknesses;
}
// 自分と相手の相性を分析
function analyzeMatchup(myParty, enemyParty) {
    const matchup = [];
    myParty.forEach(function(myPokemon) {
        const row = {
            name: myPokemon.name,
            matchups: []
        };
        enemyParty.forEach(function(enemyPokemon) {
            let bestMultiplier = 0;
            myPokemon.types.forEach(function(attackType) {
                const multiplier = getTypeMultiplier(attackType, enemyPokemon.types);
                if (multiplier > bestMultiplier) {
                    bestMultiplier = multiplier;
                }
            });
            row.matchups.push({
                name: enemyPokemon.name,
                multiplier: bestMultiplier
            });
        });
        matchup.push(row);
    });
    return matchup;
}
// タイプ相性倍率を取得
function getTypeMultiplier(attackType, defenseTypes) {
    attackType = normalizeType(attackType);
    defenseTypes = defenseTypes.map(normalizeType);
    if (!typeChart[attackType]) {
        return 1;
    }
    let multiplier = 1;
    defenseTypes.forEach(function(defenseType) {
        if (typeChart[attackType].superEffective.includes(defenseType)) {
            multiplier *= 2;
        } else if (typeChart[attackType].notVeryEffective.includes(defenseType)) {
            multiplier *= 0.5;
        } else if (typeChart[attackType].noEffect.includes(defenseType)) {
            multiplier *= 0;
        }
    });
    return multiplier;
}
// 分析結果を表示
function displayAnalysisResult(result) {
    const analysisResult = document.getElementById('analysisResult');
    let html = '';
    html += '<div class="result-title">📊 パーティ分析結果</div>';
    html += '<div class="result-section">';
    html += '<h4>🛡️ 自分のパーティのタイプ一貫性</h4>';
    html += '<div class="weakness-grid">';
    typeList.forEach(function(type) {
        const data = result.myParty[type.en];
        let className = '';
        let text = '';
        if (data.isConsistent) {
            className = 'weakness-good';
            text = '一貫';
        } else if (data.canResist) {
            className = 'weakness-normal';
            text = '受けあり';
        } else {
            className = 'weakness-danger';
            text = '一貫';
        }
        html += `<div class="weakness-item ${className}"><span>${type.jp}</span><span>${text}</span></div>`;
    });
    html += '</div>';
    html += '</div>';
    html += '<div class="result-section">';
    html += '<h4>🎯 相手パーティの弱点数</h4>';
    html += '<div class="weakness-grid">';
    typeList.forEach(function(type) {
        const count = result.enemyParty[type.en];
        let className = 'weakness-normal';
        if (count >= 3) {
            className = 'weakness-danger';
        } else if (count === 0) {
            className = 'weakness-good';
        }
        html += `<div class="weakness-item ${className}"><span>${type.jp}</span><span>${count}体</span></div>`;
    });
    html += '</div>';
    html += '</div>';
    displayTypeWeaknessTable(result, html);
}
// タイプ相性表を表示
function displayTypeWeaknessTable(result, html) {
    html += '<div class="result-section">';
    html += '<h4>⚔️ 自分のポケモン vs 相手のポケモン</h4>';
    if (result.matchup.length === 0 || result.matchup.every(function(row) {
        return row.matchups.length === 0;
    })) {
        html += '<p>ポケモンを選択してください。</p>';
    } else {
        html += '<div class="matchup-table-container">';
        html += '<table class="matchup-table">';
        html += '<thead><tr><th>自分＼相手</th>';
        if (result.matchup.length > 0 && result.matchup[0].matchups.length > 0) {
            result.matchup[0].matchups.forEach(function(enemy) {
                html += `<th>${enemy.name}</th>`;
            });
        }
        html += '</tr></thead>';
        html += '<tbody>';
        result.matchup.forEach(function(myPokemon) {
            html += `<tr><th>${myPokemon.name}</th>`;
            myPokemon.matchups.forEach(function(matchup) {
                let className = '';
                let text = '';
                if (matchup.multiplier >= 2) {
                    className = 'super-effective';
                    text = '◎';
                } else if (matchup.multiplier === 0) {
                    className = 'no-effect';
                    text = '×';
                } else if (matchup.multiplier < 1) {
                    className = 'not-effective';
                    text = '△';
                } else {
                    className = 'normal-effect';
                    text = '○';
                }
                html += `<td class="${className}">${text}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
    }
    html += '</div>';
    showResult(html);
}
// 結果を表示
function showResult(html) {
    const result = document.getElementById('analysisResult');
    result.innerHTML = html;
    result.classList.add('show');
    result.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
// 攻撃タイプ補完チェッカーを初期化
function initializeAttackTypeChecker() {
    const container = document.getElementById('attackTypeChecks');
    container.innerHTML = '';
    typeList.forEach(function(type) {
        const label = document.createElement('label');
        label.className = 'attack-type-check';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = type.en;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(type.jp));
        container.appendChild(label);
    });
}
// 攻撃タイプのチェックをすべて外す
function clearAttackTypes() {
    document.querySelectorAll('#attackTypeChecks input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.checked = false;
    });
}
// 攻撃タイプ補完を分析
function analyzeAttackTypeComplement() {
    const selectedTypes = Array.from(document.querySelectorAll('#attackTypeChecks input:checked')).map(function(checkbox) {
        return checkbox.value;
    });
    const result = document.getElementById('attackAnalysisResult');
    if (selectedTypes.length === 0) {
        result.innerHTML = '<div class="warning">⚠️ 攻撃タイプを1つ以上選択してください</div>';
        result.classList.add('show');
        return;
    }
    const types = typeList.map(function(type) {
        return type.en;
    });
    const defensiveConfigurations = [];
    types.forEach(function(type) {
        defensiveConfigurations.push([type]);
    });
    for (let i = 0; i < types.length; i++) {
        for (let j = i + 1; j < types.length; j++) {
            defensiveConfigurations.push([types[i], types[j]]);
        }
    }
    const uncoveredConfigurations = defensiveConfigurations.filter(function(defenseTypes) {
        return selectedTypes.every(function(attackType) {
            return getTypeMultiplier(attackType, defenseTypes) < 2;
        });
    });
    let html = '<div class="result-title">📊 攻撃タイプ補完の分析結果</div>';
    html += '<div class="result-section">';
    html += '<h4>選択した攻撃タイプ</h4>';
    html += '<div class="selected-attack-types">';
    selectedTypes.forEach(function(type) {
        html += `<span class="selected-attack-type">${getTypeNameJP(type)}</span>`;
    });
    html += '</div>';
    html += '</div>';
    if (uncoveredConfigurations.length === 0) {
        html += '<div class="success">✅ 選択した攻撃タイプですべてのタイプ構成に抜群を取れます。</div>';
    } else {
        html += `<div class="result-section"><h4>⚠️ 抜群で通らない防御タイプ（${uncoveredConfigurations.length}通り）</h4>`;
        html += '<div class="dual-type-list">';
        uncoveredConfigurations.forEach(function(defenseTypes) {
            html += `<div class="dual-type-item">${defenseTypes.map(getTypeNameJP).join(' / ')}</div>`;
        });
        html += '</div></div>';
    }
    result.innerHTML = html;
    result.classList.add('show');
    result.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
