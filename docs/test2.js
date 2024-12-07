const result = [...Array(100)].map((_, i) => ["", "", "", -1]);


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

function getCombinations(items, max_combination) {

    const combinations = [];
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            // if (combinations.length >= max_combination) {
            //     break;
            // }
            if (items[i] !== items[j]) {
                let [l, r] = Math.random() < 0.5 ? [i, j] : [j, i];
                combinations.push([items[l], items[r]]);
            }

        }
    }

    if (combinations.length < max_combination) {
        console.log("error");
        throw new Error("指定された個数の組み合わせを作ることができません");
    }

    return shortenArray(combinations.sort(() => Math.random() - 0.5), max_combination);
}

function generateQuestions(items, num_combinations, num_per_combination) {

    if (items.length < 2) {
        throw new Error("配列の要素数は2以上でなければなりません");
    }

    const cs = getCombinations(items, num_combinations);

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

    return questions;

}

function displayQuestions() {

    // console.log(`test`);
    const items = ["電車", "コップ", "歯ブラシ", "リモコン", "ショーン", "サイ", "フォーク", "ヨーグルト", "くつ", "バケツ"];

    const num_combinations = 10;
    const num_per_combination = 6;

    const questions = generateQuestions(items, num_combinations, num_per_combination)

    const container = document.getElementById("questions-container");

    questions.forEach((question, index) => {
        const [a, b, order] = question;

        const questionDiv = document.createElement("div");
        questionDiv.className = "question";

        // console.log(`${index}: (${a} ${b}) ${order}`);

        const questionText = document.createElement("p");
        questionText.textContent = `${index + 1}: (${a} ${b}) ${order}`;
        questionDiv.appendChild(questionText);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const yesButton = document.createElement("button");        
        yesButton.className = "button";
        yesButton.textContent = "正";
        yesButton.addEventListener("click", () => handleAnswer(index, a, b, order, 1));
        yesButton.addEventListener("click", () => {
            setActiveButton(yesButton, noButton); // Yesボタンをアクティブに
        });


        const noButton = document.createElement("button");
        noButton.className = "button";
        noButton.textContent = "誤";
        noButton.addEventListener("click", () => handleAnswer(index, a, b, order, 0));
        noButton.addEventListener("click", () => {
            setActiveButton(noButton, yesButton); // Noボタンをアクティブに
        });

        buttonsDiv.appendChild(yesButton);
        buttonsDiv.appendChild(noButton);
        questionDiv.appendChild(buttonsDiv);

        container.appendChild(questionDiv);

    });
}

// アクティブ状態を設定する関数
function setActiveButton(activeButton, inactiveButton) {
    // アクティブボタンにクラスを追加
    activeButton.classList.add("active");

    // 非アクティブボタンからクラスを削除
    inactiveButton.classList.remove("active");
}

function handleAnswer(index, l, r, order, res) {

    console.log(`handle ${index}: (${l} ${r}) ${order} ${res}`);

    result[index] = [l, r, order, res];

    console.log(`${result[index]}`);

    displayResult();
}


function recordResult(index, l, r, order, res) {
    result[index] = [l, r, order, res];
}

function displayResult() {

    const total = new Map();
    const positive = new Map();
    const keys = new Set();

    const output = []

    result.forEach((_, i) => {

        let [left, right, order, res] = result[i];

        if (res > -1) {
            console.log(`${i}: (${left} ${right}) ${order} ${res}`);

            total.set(order, (total.get(order) || 0) + 1);
            positive.set(order, (positive.get(order) || 0) + res);

            keys.add(order);
        }

    });

    keys.forEach((key) => {
        // console.log(`${key} ${positive.get(key)}/${total.get(key)}`);

        output.push(`${key} ${positive.get(key)}/${total.get(key)}`);
    });

    const htmlContent = output.join('<br>');

    document.getElementById("output").innerHTML = htmlContent;

}


displayQuestions();

document.getElementById("copyButton").addEventListener("click", () => {
    // 出力要素を取得
    const output = document.getElementById("output");
    const textToCopy = output.textContent; // または innerText を使用

    // クリップボードにコピー
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("クリップボードにコピーしました！");
    }).catch(err => {
        console.error("コピーに失敗しました: ", err);
        alert("コピーに失敗しました。");
    });
});

/* 
try {

    const items = ["A", "B", "C", "D", "E"];

    const num_combinations = 10;
    const num_per_combination = 10;

    generateQuestions(items, num_combinations, num_per_combination)



} catch (error) {
    console.error(error.message);
}
 */