// ==========================================
// ページ読み込み時の初期化
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    console.log('ページ読み込み完了');

    // パーティスロットを初期化
    initializePartySlots();

    // パーティ分析ボタン
    document.getElementById('analyzeBtn')
        .addEventListener('click', analyzeParty);

    // 攻撃タイプ補完チェッカーを初期化
    initializeAttackTypeChecker();

    // ページ切り替え
    document.getElementById('partyPageBtn')
        .addEventListener('click', function() {
            showPage('party');
        });

    document.getElementById('attackPageBtn')
        .addEventListener('click', function() {
            showPage('attack');
        });

    // 攻撃タイプ補完の分析ボタン
    document.getElementById('checkAttackBtn')
        .addEventListener('click', analyzeAttackTypeComplement);

});


// ==========================================
// ページ切り替え
// ==========================================

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

    }


    if (page === 'attack') {

        partyPage.style.display = 'none';
        attackPage.style.display = 'block';

        partyPageBtn.classList.remove('active');
        attackPageBtn.classList.add('active');

    }

}


// ==========================================
// パーティスロットを初期化
// ==========================================

function initializePartySlots() {

    console.log('パーティスロット初期化中...');

    const myPartyDiv = document.getElementById('myParty');
    const enemyPartyDiv = document.getElementById('enemyParty');


    // 自分のパーティ
    for (let i = 0; i < 6; i++) {

        myPartyDiv.appendChild(
            createPokemonSlot(`myPokemon${i}`)
        );

    }


    // 相手のパーティ
    for (let i = 0; i < 6; i++) {

        enemyPartyDiv.appendChild(
            createPokemonSlot(`enemyPokemon${i}`)
        );

    }


    console.log('パーティスロット作成完了');

}


// ==========================================
// ポケモンスロットを作成
// ==========================================

function createPokemonSlot(id) {

    const div = document.createElement('div');

    div.className = 'pokemon-slot';


    // チェックボックス

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


    // ポケモン入力

    const pokemonContainer = document.createElement('div');

    pokemonContainer.className =
        'type-input-container pokemon-input-container';

    pokemonContainer.id =
        id + '-pokemon-container';


    const pokemonInput = document.createElement('input');

    pokemonInput.type = 'text';
    pokemonInput.id = id + '-pokemon-search';
    pokemonInput.className = 'type-search-input';
    pokemonInput.placeholder = 'ポケモンを選択';
    pokemonInput.autocomplete = 'off';


    const pokemonDropdown = document.createElement('div');

    pokemonDropdown.className = 'type-dropdown-list';

    pokemonDropdown.id =
        id + '-pokemon-dropdown';


    createPokemonDropdown(
        pokemonInput,
        pokemonDropdown,
        id
    );


    pokemonContainer.appendChild(pokemonInput);
    pokemonContainer.appendChild(pokemonDropdown);


    // タイプ1

    const type1Container = document.createElement('div');

    type1Container.className =
        'type-input-container';

    type1Container.id =
        id + '-type1-container';


    const type1Input = document.createElement('input');

    type1Input.type = 'text';
    type1Input.id = id + '-type1-search';
    type1Input.className = 'type-search-input';
    type1Input.placeholder = 'タイプ1';
    type1Input.autocomplete = 'off';


    const type1Dropdown = document.createElement('div');

    type1Dropdown.className =
        'type-dropdown-list';

    type1Dropdown.id =
        id + '-type1-dropdown';


    createTypeDropdown(
        type1Input,
        type1Dropdown,
        id + '-type1'
    );


    type1Container.appendChild(type1Input);
    type1Container.appendChild(type1Dropdown);


    // タイプ2

    const type2Container = document.createElement('div');

    type2Container.className =
        'type-input-container';

    type2Container.id =
        id + '-type2-container';


    const type2Input = document.createElement('input');

    type2Input.type = 'text';
    type2Input.id = id + '-type2-search';
    type2Input.className = 'type-search-input';
    type2Input.placeholder = 'タイプ2';
    type2Input.autocomplete = 'off';


    const type2Dropdown = document.createElement('div');

    type2Dropdown.className =
        'type-dropdown-list';

    type2Dropdown.id =
        id + '-type2-dropdown';


    createTypeDropdown(
        type2Input,
        type2Dropdown,
        id + '-type2'
    );


    type2Container.appendChild(type2Input);
    type2Container.appendChild(type2Dropdown);


    // スロットに追加

    div.appendChild(checkbox);
    div.appendChild(pokemonContainer);
    div.appendChild(type1Container);
    div.appendChild(type2Container);


    return div;

}


// ==========================================
// タイプドロップダウン
// ==========================================

function createTypeDropdown(input, dropdown, dataId) {

    input.addEventListener('focus', function() {

        showTypeDropdown(
            dropdown,
            input.value
        );

        dropdown.style.display = 'block';

    });


    input.addEventListener('input', function() {

        showTypeDropdown(
            dropdown,
            input.value
        );

    });


    input.addEventListener('blur', function() {

        setTimeout(function() {

            dropdown.style.display = 'none';

        }, 200);

    });

}


// ==========================================
// ポケモンドロップダウン
// ==========================================

function createPokemonDropdown(input, dropdown, id) {

    input.addEventListener('focus', function() {

        showPokemonDropdown(
            dropdown,
            input.value
        );

        dropdown.style.display = 'block';

    });


    input.addEventListener('input', function() {

        showPokemonDropdown(
            dropdown,
            input.value
        );

    });


    input.addEventListener('blur', function() {

        setTimeout(function() {

            dropdown.style.display = 'none';

        }, 200);

    });

}


// ==========================================
// ポケモンドロップダウンを表示
// ==========================================

function showPokemonDropdown(dropdown, searchText) {

    dropdown.innerHTML = '';


    const searchHiragana =
        toHiragana(searchText.toLowerCase());


    pokemonList.forEach(function(pokemon) {

        const pokemonHiragana =
            toHiragana(pokemon.toLowerCase());


        if (
            pokemonHiragana.includes(searchHiragana) ||
            pokemon.includes(searchText)
        ) {

            const item =
                document.createElement('div');


            item.className =
                'type-dropdown-item';

            item.textContent = pokemon;


            item.addEventListener(
                'mousedown',
                function() {

                    const input =
                        dropdown.previousElementSibling;


                    input.value = pokemon;

                    input.dataset.pokemon =
                        pokemon;


                    dropdown.style.display =
                        'none';


                    updatePokemonTypesFromSearch(
                        input.id.replace(
                            '-pokemon-search',
                            ''
                        ),
                        pokemon
                    );

                }
            );


            dropdown.appendChild(item);

        }

    });

}


// ==========================================
// ポケモン選択時にタイプを更新
// ==========================================

function updatePokemonTypesFromSearch(
    id,
    pokemonName
) {

    if (
        pokemonName &&
        pokemonDatabase[pokemonName]
    ) {

        const pokemonInfo =
            pokemonDatabase[pokemonName];


        const types =
            pokemonInfo.types;


        const type1Input =
            document.getElementById(
                id + '-type1-search'
            );


        type1Input.value =
            getTypeNameJP(types[0]);

        type1Input.dataset.type =
            types[0];


        const type2Input =
            document.getElementById(
                id + '-type2-search'
            );


        if (types[1]) {

            type2Input.value =
                getTypeNameJP(types[1]);

            type2Input.dataset.type =
                types[1];

        } else {

            type2Input.value = '';

            type2Input.dataset.type = '';

        }

    }

}


// ==========================================
// タイプドロップダウンを表示
// ==========================================

function showTypeDropdown(
    dropdown,
    searchText
) {

    dropdown.innerHTML = '';


    const searchHiragana =
        toHiragana(searchText.toLowerCase());


    typeList.forEach(function(type) {

        const typeHiragana =
            toHiragana(type.jp.toLowerCase());


        if (
            typeHiragana.includes(searchHiragana) ||
            type.jp.includes(searchText)
        ) {

            const item =
                document.createElement('div');


            item.className =
                'type-dropdown-item';

            item.textContent =
                type.jp;


            item.addEventListener(
                'click',
                function() {

                    const input =
                        dropdown.previousElementSibling;


                    input.value =
                        type.jp;

                    input.dataset.type =
                        type.en;


                    dropdown.style.display =
                        'none';

                }
            );


            dropdown.appendChild(item);

        }

    });

}


// ==========================================
// パーティを分析
// ==========================================

function analyzeParty() {

    console.log('パーティ分析開始');


    const myParty =
        getPartyData('myPokemon');


    const enemyParty =
        getPartyData('enemyPokemon');


    console.log(
        '自分のパーティ:',
        myParty
    );


    console.log(
        '相手のパーティ:',
        enemyParty
    );


    // 入力チェック

    if (myParty.length === 0) {

        showResult(
            '<div class="warning">' +
            '⚠️ 最低1匹以上ポケモン（またはタイプ）を入力してください' +
            '</div>'
        );

        return;

    }


    // 分析

    const myAnalysis =
        analyzeOwnPartyWeakness(myParty);


    const enemyAnalysis =
        enemyParty.length > 0
            ? analyzeOwnPartyWeakness(enemyParty)
            : null;


    // 結果表示

    displayAnalysisResult(
        myAnalysis,
        myParty,
        enemyAnalysis,
        enemyParty
    );

}


// ==========================================
// パーティデータを取得
// ==========================================

function getPartyData(prefix) {

    const party = [];


    for (let i = 0; i < 6; i++) {

        const checkbox =
            document.getElementById(
                `${prefix}${i}-check`
            );


        const pokemonInput =
            document.getElementById(
                `${prefix}${i}-pokemon-search`
            );


        const type1Input =
            document.getElementById(
                `${prefix}${i}-type1-search`
            );


        const type2Input =
            document.getElementById(
                `${prefix}${i}-type2-search`
            );


        // 念のため存在確認

        if (
            !checkbox ||
            !pokemonInput ||
            !type1Input ||
            !type2Input
        ) {
            continue;
        }


        const pokemonName =
            pokemonInput.value.trim();


        const type1 =
            type1Input.dataset.type || '';


        const type2 =
            type2Input.dataset.type || '';


        // チェックOFFなら除外

        if (!checkbox.checked) {
            continue;
        }


        // ポケモンが選択されている場合

        if (
            pokemonName &&
            pokemonDatabase[pokemonName]
        ) {

            const pokemonInfo =
                pokemonDatabase[pokemonName];


            party.push({

                name: pokemonName,

                types: pokemonInfo.types

            });

        }


        // タイプだけ入力されている場合

        else if (type1) {

            const types = [type1];


            if (
                type2 &&
                type2 !== type1
            ) {

                types.push(type2);

            }


            party.push({

                name:
                    `(${types.map(
                        function(t) {
                            return getTypeNameJP(t);
                        }
                    ).join('/')})`,

                types: types

            });

        }

    }


    return party;

}


// ==========================================
// パーティの一貫性を分析
// ==========================================

function analyzeOwnPartyWeakness(party) {

    const analysis = {

        typeWeakness: {},

        typeStatus: {}

    };


    // タイプごとの弱点情報

    party.forEach(function(pokemon) {

        pokemon.types.forEach(function(defType) {

            if (!analysis.typeWeakness[defType]) {

                analysis.typeWeakness[defType] = {

                    type: defType,

                    weakness: []

                };

            }

        });

    });


    // 全18攻撃タイプを調べる

    Object.keys(typeChart).forEach(
        function(attackType) {


            // パーティに半減以下がいるか

            const canResist =
                party.some(function(pokemon) {

                    const multiplier =
                        getTypeMultiplier(
                            attackType,
                            pokemon.types
                        );


                    return multiplier <= 0.5;

                });


            // パーティに弱点がいるか

            const hasWeakness =
                party.some(function(pokemon) {

                    const multiplier =
                        getTypeMultiplier(
                            attackType,
                            pokemon.types
                        );


                    return multiplier >= 2;

                });


            // 全員等倍か

            const allNeutral =
                party.length > 0 &&
                party.every(function(pokemon) {

                    return getTypeMultiplier(
                        attackType,
                        pokemon.types
                    ) === 1;

                });


            analysis.typeStatus[attackType] = {

                type: attackType,

                isConsistent:
                    (hasWeakness || allNeutral) &&
                    !canResist,

                consistencyType:
                    allNeutral
                        ? 'neutral'
                        : 'weakness'

            };

        }
    );


    // 各単タイプの弱点

    Object.keys(typeChart).forEach(
        function(defType) {

            const weakness = [];


            Object.keys(typeChart).forEach(
                function(attackType) {

                    const multiplier =
                        getTypeMultiplier(
                            attackType,
                            [defType]
                        );


                    if (multiplier >= 2) {

                        weakness.push(
                            attackType
                        );

                    }

                }
            );


            if (weakness.length > 0) {

                analysis.typeWeakness[defType] = {

                    type: defType,

                    weakness: weakness

                };

            }

        }
    );


    return analysis;

}


// ==========================================
// 複合タイプの最終倍率を計算
// ==========================================

function getTypeMultiplier(
    attackType,
    defenseTypes
) {

    let multiplier = 1;


    defenseTypes.forEach(
        function(defenseType) {

            const attackData =
                typeChart[attackType];


            if (!attackData) {
                return;
            }


            // 無効

            if (
                attackData.noEffect.includes(
                    defenseType
                )
            ) {

                multiplier *= 0;

            }


            // 半減

            else if (
                attackData.notVeryEffective.includes(
                    defenseType
                )
            ) {

                multiplier *= 0.5;

            }


            // 弱点

            else if (
                attackData.superEffective.includes(
                    defenseType
                )
            ) {

                multiplier *= 2;

            }

        }
    );


    return multiplier;

}


// ==========================================
// パーティ分析結果を表示
// ==========================================

function displayAnalysisResult(
    myAnalysis,
    myParty,
    enemyAnalysis,
    enemyParty
) {

    let html =
        '<div class="result-title">' +
        '📊 パーティ弱点分析結果' +
        '</div>';


    // 自分のパーティ

    html +=
        '<div class="result-section">';

    html +=
        '<h4>👤 自分のパーティ</h4>';

    html +=
        '<div class="result-content">';


    myParty.forEach(function(p) {

        const typeStr =
            p.types
                .map(function(t) {
                    return getTypeNameJP(t);
                })
                .join('/');


        html +=
            `<div>• ${p.name} (${typeStr})</div>`;

    });


    html += '</div>';
    html += '</div>';


    // 自分の一貫タイプ

    html +=
        displayTypeWeaknessTable(
            '自分',
            myAnalysis
        );


    // 相手

    if (enemyParty.length > 0) {

        html +=
            '<div class="result-section">';

        html +=
            '<h4>🎯 相手のパーティ</h4>';

        html +=
            '<div class="result-content">';


        enemyParty.forEach(function(p) {

            const typeStr =
                p.types
                    .map(function(t) {
                        return getTypeNameJP(t);
                    })
                    .join('/');


            html +=
                `<div>• ${p.name} (${typeStr})</div>`;

        });


        html += '</div>';
        html += '</div>';


        html +=
            displayTypeWeaknessTable(
                '相手',
                enemyAnalysis
            );

    }


    showResult(html);

}


// ==========================================
// 一貫タイプを表示
// ==========================================

function displayTypeWeaknessTable(
    label,
    analysis
) {

    let html =
        '<div class="result-section">';


    html +=
        `<h4>🛡️ ${label}のパーティの一貫タイプ</h4>`;


    const consistentTypes =
        Object.keys(
            analysis.typeStatus
        ).filter(function(type) {

            return analysis
                .typeStatus[type]
                .isConsistent;

        });


    if (consistentTypes.length === 0) {

        html +=
            '<div class="success">' +
            '✅ 一貫しているタイプはありません' +
            '</div>';

    }


    else {

        html +=
            '<table class="type-table">';

        html +=
            '<thead><tr>';

        html +=
            '<th>攻撃タイプ</th>';

        html +=
            '<th>一貫の種類</th>';

        html +=
            '</tr></thead>';

        html +=
            '<tbody>';


        consistentTypes.forEach(
            function(type) {

                const status =
                    analysis
                        .typeStatus[type]
                        .consistencyType;


                html += '<tr>';

                html +=
                    `<td class="type-name">` +
                    `${getTypeNameJP(type)}` +
                    `</td>`;


                if (status === 'neutral') {

                    html +=
                        '<td>等倍一貫</td>';

                } else {

                    html +=
                        '<td>⚠️ 弱点一貫</td>';

                }


                html += '</tr>';

            }
        );


        html += '</tbody>';
        html += '</table>';

    }


    html += '</div>';


    return html;

}


// ==========================================
// 結果を表示
// ==========================================

function showResult(html) {

    const resultDiv =
        document.getElementById(
            'analysisResult'
        );


    resultDiv.innerHTML = html;

    resultDiv.classList.add('show');


    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

}


// ==========================================
// 攻撃タイプ補完チェッカー
// ==========================================

// 18タイプのチェックボックスを作る

function initializeAttackTypeChecker() {

    const container =
        document.getElementById(
            'attackTypeChecks'
        );


    typeList.forEach(function(type) {

        const label =
            document.createElement('label');


        label.className =
            'attack-type-check';


        const checkbox =
            document.createElement('input');


        checkbox.type = 'checkbox';

        checkbox.value = type.en;

        checkbox.dataset.type = type.en;


        const text =
            document.createElement('span');


        text.textContent =
            type.jp;


        label.appendChild(checkbox);

        label.appendChild(text);


        container.appendChild(label);

    });

}


// ==========================================
// 攻撃タイプ補完を分析
// ==========================================

function analyzeAttackTypeComplement() {

    console.log(
        '攻撃タイプ補完分析開始'
    );


    // 選択された攻撃タイプ

    const checkedTypes = [];


    document.querySelectorAll(
        '#attackTypeChecks input[type="checkbox"]:checked'
    ).forEach(function(checkbox) {

        checkedTypes.push(
            checkbox.value
        );

    });


    const resultDiv =
        document.getElementById(
            'attackAnalysisResult'
        );


    // 攻撃タイプ未選択

    if (checkedTypes.length === 0) {

        resultDiv.innerHTML =
            '<div class="warning">' +
            '⚠️ 攻撃タイプを1つ以上選択してください' +
            '</div>';


        resultDiv.classList.add('show');


        return;

    }


    // ======================================
    // 防御側タイプを作る
    // ======================================

    const defenseTypesList = [];


    // 単タイプ18種類

    typeList.forEach(function(type) {

        defenseTypesList.push([
            type.en
        ]);

    });


    // 複合タイプ153種類

    for (
        let i = 0;
        i < typeList.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < typeList.length;
            j++
        ) {

            defenseTypesList.push([

                typeList[i].en,

                typeList[j].en

            ]);

        }

    }


    // ======================================
    // 抜群で通らないタイプを探す
    // ======================================

    const notSuperEffective = [];


    defenseTypesList.forEach(
        function(defenseTypes) {


            // 選択した攻撃タイプの中に
            // 1つでも2倍以上があるか

            const canHitSuperEffective =
                checkedTypes.some(
                    function(attackType) {

                        const multiplier =
                            getTypeMultiplier(
                                attackType,
                                defenseTypes
                            );


                        return multiplier >= 2;

                    }
                );


            // 1つも抜群がない

            if (!canHitSuperEffective) {

                notSuperEffective.push(
                    defenseTypes
                );

            }

        }
    );


    // ======================================
    // 結果表示
    // ======================================

    let html = '';


    // 選択した攻撃タイプ

    html +=
        '<div class="result-section">';

    html +=
        '<h4>⚔️ 選択した攻撃タイプ</h4>';


    html +=
        '<div class="selected-attack-types">';


    checkedTypes.forEach(function(type) {

        html +=
            `<span class="selected-attack-type">` +
            `${getTypeNameJP(type)}` +
            `</span>`;

    });


    html += '</div>';

    html += '</div>';


    // 抜群で通らないタイプ

    html +=
        '<div class="result-section">';


    html +=
        `<h4>🛡️ 抜群で通らないタイプ ` +
        `（${notSuperEffective.length}種類）</h4>`;


    // 0種類の場合

    if (
        notSuperEffective.length === 0
    ) {

        html +=
            '<div class="success">' +
            '✅ 抜群で通らないタイプはありません' +
            '</div>';

    }


    // 該当タイプがある場合

    else {

        html +=
            '<div class="dual-type-list">';


        notSuperEffective.forEach(
            function(types) {

                const type1JP =
                    getTypeNameJP(
                        types[0]
                    );


                let typeName =
                    type1JP;


                // 複合タイプの場合

                if (types[1]) {

                    const type2JP =
                        getTypeNameJP(
                            types[1]
                        );


                    typeName =
                        `${type1JP} / ${type2JP}`;

                }


                html +=
                    `<div class="dual-type-item">` +
                    `${typeName}` +
                    `</div>`;

            }
        );


        html += '</div>';

    }


    html += '</div>';


    resultDiv.innerHTML =
        html;


    resultDiv.classList.add(
        'show'
    );


    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

}
