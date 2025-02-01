const result = [...Array(100)].map((_, i) => ["", "", "", -1, ""]);

const easy = ['電車', 'コップ', '歯ブラシ'];


// シャッフル関数（Fisher-Yates）
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shortenArray(array, n) {
    if (n <= 0) {
        throw new Error("長さ n は正の整数である必要があります");
    }
    if (n >= array.length) {
        return array; // 元の配列を返す（縮める必要がない）
    }

    const step = array.length / n; // 間隔を計算
    const result = [];

    for (let i = 0; i < n; i++) {
        const index = Math.floor(i * step); // インデックスを計算
        result.push(array[index]);
    }

    return result;
}

function getCombinations2(items, comb_required) {

    let remainingDifficult = [...items];
    shuffle(remainingDifficult);

    function getRandomPair() {
        if (remainingDifficult.length === 0) {
            remainingDifficult = [...items];
            shuffle(remainingDifficult);
        }

        const difficultItem = remainingDifficult.pop();
        const easyItem = easy[Math.floor(Math.random() * easy.length)];

        // 左右をランダムに配置
        if (Math.random() < 0.5) {
            return [difficultItem, easyItem];
        } else {
            return [easyItem, difficultItem];
        }
    }

    const combinations = [];
    const pairs = new Set();

    while (combinations.length < comb_required) {

        const [p, q] = getRandomPair();
        combinations.push([p, q]);

    }

    return combinations;
}


function generateQuestions(items, num_combinations, num_per_combination) {

    if (items.length < 2) {
        throw new Error("配列の要素数は2以上でなければなりません");
    }

    const cs = getCombinations2(items, num_combinations);

    console.log("CHECK2", num_combinations, num_per_combination);

    let counter = 0;
    let window3 = 0;
    let previous = '';

    let questions = [];

    for (const pair of cs) {
        const [a, b] = pair;

        for (let i = 0; i < num_per_combination; i++) {
            direction = Math.random() < 0.5 ? 0 : 1;

            if (previous == direction) {
                window3++;
            } else {
                window3 = 0;
            }

            if (window3 > 2) {
                direction = direction === 0 ? 1 : 0;
                window3 = 0;
            }

            questions.push([a, b, pair[direction]]);

            // console.log(`${counter}: (${a} ${b}) ${pair[direction]}`);
            // const value = Math.random() < 0.5 ? 0 : 1;
            // recordResult(counter, a, b, pair[direction], value);

            previous = direction;

            counter++;
        }

    }

    return [questions, cs];

}

function displayQuestions(items, num_combinations, num_per_combination) {

    const total = new Map();

    const [questions, combinations] = generateQuestions(items, num_combinations, num_per_combination)

    const container = document.getElementById("questions-container");
    container.innerHTML = ""; // 古い内容を削除

    let counter = 0;

    questions.forEach((question, index) => {

        const [a, b, order] = question;

        total.set(order, (total.get(order) || 0) + 1);

        let scroll_length = 100;
        if ((counter + 1) % num_per_combination === 0) {
            scroll_length = 177;
        }

        const questionDiv = document.createElement("div");
        questionDiv.className = "question";

        const questionText = document.createElement("p");
        if (counter % num_per_combination === 0) {
            questionText.innerHTML = `<hr> (${a} ${b})<hr> <br> ${index + 1}: ${order}`;
        } else {
            questionText.innerHTML = `${index + 1}: ${order}`;
        }

        questionDiv.appendChild(questionText);

        // console.log(`${index}: (${a} ${b}) ${order}`);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const yesButton = document.createElement("button");
        yesButton.style.marginRight = "20px"; // ボタン間に間隔を設ける
        yesButton.className = "button";
        yesButton.textContent = "正";
        yesButton.addEventListener("click", () => {
            handleAnswer(questions, index, a, b, order, 1);
            setActiveButton(yesButton, noButton); // Yesボタンをアクティブに
            window.scrollBy({
                top: scroll_length, // 下にスクロール
                left: 0,
                behavior: "smooth" // スムーズなスクロール
            });
        });


        const noButton = document.createElement("button");
        noButton.className = "button";
        noButton.textContent = "誤";
        noButton.addEventListener("click", () => {
            handleAnswer(questions, index, a, b, order, 0);
            setActiveButton(noButton, yesButton); // Noボタンをアクティブに
            window.scrollBy({
                top: scroll_length, // 下にスクロール
                left: 0,
                behavior: "smooth" // スムーズなスクロール
            });
        });

        buttonsDiv.appendChild(yesButton);
        buttonsDiv.appendChild(noButton);
        questionDiv.appendChild(buttonsDiv);

        container.appendChild(questionDiv);

        counter++;

    });


    const output = [];

    total.forEach((value, key) => {
        output.push(`${key} ${value}`);
    });

    const str1 = output.join(' ');

    output.length = 0;
    combinations.forEach((pair) => {
        const [a, b] = pair;
        output.push(`${a} vs ${b}`);
    })

    const str2 = output.join('<br>');

    const htmlContent = str2 + '<br><hr>' + str1;

    document.getElementById("dist").innerHTML = htmlContent;



}

// アクティブ状態を設定する関数
function setActiveButton(activeButton, inactiveButton) {
    // アクティブボタンにクラスを追加
    activeButton.classList.add("active");

    // 非アクティブボタンからクラスを削除
    inactiveButton.classList.remove("active");
}

function handleAnswer(questions, index, l, r, order, res) {

    console.log(`handle ${index}: (${l} ${r}) ${order} ${res}`);

    result[index] = [l, r, order, res];

    console.log(`${result[index]}`);

    displayResult(questions);
}


function recordResult(index, l, r, order, res) {
    result[index] = [l, r, order, res];
}

function displayResult(questions) {

    const total = new Map();
    const positive = new Map();
    const keys = new Set();
    const pair0 = new Map();
    const pair1 = new Map();

    const detailMap = new Map();

    const output = [];

    let previous = '';
    let detail = '';

    result.forEach((_, i) => {

        let [left, right, order, res] = result[i];

        if (res > -1) {
            // console.log(`${i}: (${left} ${right}) ${order} ${res}`);

            const p = `${left} ${right}`;

            total.set(order, (total.get(order) || 0) + 1);
            positive.set(order, (positive.get(order) || 0) + res);
            pair0.set(p, (pair0.get(p) || 0) + res);
            pair1.set(p, (pair1.get(p) || 0) + 1);

            keys.add(order);

            let symbol = '';
            if (left == order) { // L
                if (result[i][3] == 1) {
                    symbol = "L";
                } else {
                    symbol = "l";
                }
            } else { // R
                if (result[i][3] == 1) {
                    symbol = "R";
                } else {
                    symbol = "r";
                }
            }
            detailMap.set(p, (detailMap.get(p) || '') + symbol);
        }

    });

    previous = '';

    questions.forEach((question, index) => {
        const [a, b, order] = question;

        const p = `${a} ${b}`;
        const ratio = pair0.get(p) / pair1.get(p);

        if (previous !== p && pair0.has(p)) {
            output.push(`${a} vs ${b}: ${pair0.get(p)}/${pair1.get(p)} = ${ratio.toFixed(2) * 100} (${detailMap.get(p)})`);
        }
        previous = p;

    })

    output.push('');

    let total_sum = 0;
    let total_success = 0;

    keys.forEach((key) => {
        // console.log(`${key} ${positive.get(key)}/${total.get(key)}`);

        total_sum += total.get(key);
        total_success += positive.get(key);

        const ratio = positive.get(key) / total.get(key);

        output.push(`${key} ${positive.get(key)}/${total.get(key)} = ${ratio.toFixed(2) * 100}`);
    });

    const ratio = total_success / total_sum;

    output.push('');
    output.push(`全体 ${total_success}/${total_sum} = ${Math.round(ratio.toFixed(2) * 100)}<br>`);

    const htmlContent = output.join('<br>');

    document.getElementById("output").innerHTML = htmlContent;

}

document.getElementById('getChecked').addEventListener('click', function () {
    // Get all checkboxes in the form
    const checkboxes = document.querySelectorAll('#checkboxForm input[type="checkbox"]');

    // Filter the checked ones and get their values
    const selectedItems = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    let binaryNum = document.getElementById('binaryNum').value;
    let traialNum = document.getElementById('trialNum').value;

    // Display the selected items
    // document.getElementById('output').textContent = selectedItems.join(', ');

    // Log the array (optional)
    // console.log(selectedItems,binaryNum,traialNum);

    document.getElementById("output").innerHTML = "";

    displayQuestions(selectedItems, binaryNum, traialNum);

});


document.getElementById("copyButton").addEventListener("click", () => {
    // 出力要素を取得
    const output = document.getElementById("output");
    const textToCopy = output.innerText; // または innerText を使用

    // クリップボードにコピー
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("クリップボードにコピーしました！");
    }).catch(err => {
        console.error("コピーに失敗しました: ", err);
        alert("コピーに失敗しました。");
    });
});

