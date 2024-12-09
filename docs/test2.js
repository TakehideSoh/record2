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

function getCombinations2(items, max_combination) {

    let sfle = items.sort(() => 0.5 - Math.random()).slice();

    const combinations = [];    
    const pairs = new Set();

    while (combinations.length < max_combination) {

        if (sfle.length < 2) {
            sfle = sfle.concat(items.sort(() => 0.5 - Math.random()).slice());
        }

        console.log(sfle.length);

        const p = sfle.pop();
        const q = sfle.pop();

        if (pairs.has(`${p} ${q}`) && !pairs.has(`${q} ${p}`)) {
            combinations.push([q, p]);
            pairs.add(`${q} ${p}`);
        } else if (pairs.has(`${p} ${q}`) && pairs.has(`${q} ${p}`)) {
            continue;
        } else {
            combinations.push([p, q]);
            pairs.add(`${p} ${q}`);
        }

        

    }    

    return combinations;
}


function generateQuestions(items, num_combinations, num_per_combination) {

    if (items.length < 2) {
        throw new Error("配列の要素数は2以上でなければなりません");
    }

    const cs = getCombinations2(items, num_combinations);

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

function displayQuestions() {

    const items = ["電車", "コップ", "歯ブラシ", "リモコン", "ショーン", "サイ", "フォーク", "ヨーグルト", "くつ", "バケツ"];
    const num_combinations = 10;
    const num_per_combination = 6;

    const total = new Map();

    const [questions,combinations] = generateQuestions(items, num_combinations, num_per_combination)

    const container = document.getElementById("questions-container");

    let counter = 0;

    questions.forEach((question, index) => {
        const [a, b, order] = question;

        total.set(order, (total.get(order) || 0) + 1);

        const questionDiv = document.createElement("div");
        questionDiv.className = "question";

        // console.log(`${index}: (${a} ${b}) ${order}`);

        const questionText = document.createElement("p");
        if (counter % num_per_combination === 0) {
            questionText.innerHTML = `<hr> (${a} ${b})<hr> <br> ${index + 1}: ${order}`;
        } else {
            questionText.innerHTML = `${index + 1}: ${order}`;
        }
        
        questionDiv.appendChild(questionText);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const yesButton = document.createElement("button");        
        yesButton.style.marginRight = "20px"; // ボタン間に間隔を設ける
        yesButton.className = "button";
        yesButton.textContent = "正";
        yesButton.addEventListener("click", () => {
            handleAnswer(questions,index, a, b, order, 1);
            setActiveButton(yesButton, noButton); // Yesボタンをアクティブに
            window.scrollBy({
                top: 100, // 下にスクロール
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
                top: 100, // 下にスクロール
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

    const output = []

    result.forEach((_, i) => {

        let [left, right, order, res] = result[i];

        if (res > -1) {
            console.log(`${i}: (${left} ${right}) ${order} ${res}`);

            const p = `${left} ${right}`;

            total.set(order, (total.get(order) || 0) + 1);
            positive.set(order, (positive.get(order) || 0) + res);
            pair0.set(p, (pair0.get(p) || 0) + res);
            pair1.set(p, (pair1.get(p) || 0) + 1);

            keys.add(order);
        }

    });

    let previous = '';
    questions.forEach((question, index) => {
        const [a, b, order] = question;

        const p = `${a} ${b}`;

        if (previous !== p && pair0.has(p)) {
            const ratio = pair0.get(p) / pair1.get(p);
            output.push(`${a} vs ${b}: ${pair0.get(p)}/${pair1.get(p)} = ${ratio.toFixed(2) * 100}`);
        }
        previous = p;

    })

    output.push('');

    keys.forEach((key) => {
        // console.log(`${key} ${positive.get(key)}/${total.get(key)}`);

        const ratio = positive.get(key) / total.get(key);

        output.push(`${key} ${positive.get(key)}/${total.get(key)} = ${ratio.toFixed(2) * 100}`);
    });

    const htmlContent = output.join('<br>');

    document.getElementById("output").innerHTML = htmlContent;

}


displayQuestions();

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