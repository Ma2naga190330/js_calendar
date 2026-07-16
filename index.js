// ひと月ごとのカレンダーを作成する
function cale(now){
    // currentIndexから年と月の差を取得
    let [curYear,curMon] = currentDifferences();
    // 月の最終日を取得
    let lastDate = new Date(now.getFullYear()+curYear,now.getMonth()+1+curMon,0);
    // 月の最初の日を取得
    let firstDay = new Date(lastDate.getFullYear(),lastDate.getMonth(),1);
    // index.htmlに埋め込むカレンダーを入力する定数を作成
    const str = [];
    // 見出しとなる曜日を入力
    str.push(`<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`);
    let count = 0;
    // 日にちを入力する
    for (let i = 0; i < lastDate.getDate(); i++){
        // 表示する日付を定義
        let current = new Date(
            lastDate.getFullYear(),
            lastDate.getMonth(),
            i + 1
        );
        // 1週間ごとに行を分ける
        if (count === 0){
            str.push(`<tr>`);
        }
        // 最初に曜日を合わせて空白を代入
        if (i === 0){
            for (let j = 0; j < firstDay.getDay(); j++){
                str.push(`<td></td>`);
                count++;
            }
        }
        // idの作成
        const id = lastDate.getFullYear().toString()+"-"+(lastDate.getMonth()+1).toString().padStart(2,'0')+"-"+(i+1).toString().padStart(2,'0');
        // 日付の入力
        str.push(`<td id='${id}'><button id="btn${id}"><strong/>${i+1}</button></td>`);
        count++;
        // 7になったら改行
        if (count === 7){
            count = 0;
            str.push(`</tr>`);
        }
    }
    // 最後まで空白で埋める
    const lastWeekDay = lastDate.getDay();
    if (lastWeekDay != 6){
        for (i=lastWeekDay;i<6;i++){
            str.push("<td></td>");
        }
    }
    return str;
}

// 現在の年度の差分と月の差分を返す
function currentDifferences(){
    if (currentIndex === 0){
        // 最初は差分0
        return [0,0];
    }else{
        // currentIndexから年度と月の差分を算出
        return [Math.floor((now.getMonth()+currentIndex)/12),(now.getMonth()+currentIndex)%12-now.getMonth()];
    }
}



// スクロールで使用するグローバル変数
// エラー回避用にロードしたか判定用
let isLoading = false;
// カレンダーが何回追加されたかを保存
let currentIndex = 0;
// 現在の時刻データを取得
const now = new Date();
// スクロール
async function scroller(){
    // エラー回避
    if (isLoading) return;
    isLoading = true;
    const loadingElm = document.getElementById('loading');
    if (loadingElm) loadingElm.style.display = 'block';
    try{
        // カレンダー配列を取得
        const str = cale(now);
        // タイムラインを取得
        const timeline = document.getElementById('timeline');
        // 要素の作成
        const postElm = document.createElement('div');
        // クラス名をポストにする
        postElm.className='post';
        // 見出しの作成
        // カレンダーの年、月を表示するために差分を算出
        let [curYear,curMon] = currentDifferences();
        // 見出しをhtml側に送る
        postElm.innerHTML=`<h3>${now.getFullYear()+curYear}年${now.getMonth()+curMon+1}月</h3><table border="1" class="cale">${str.join("")}</table>`;
        // タイムラインを追加
        timeline.appendChild(postElm);
        // 念のために24回表示されたら終了する
        if (currentIndex === 24){
            isLoading = false;
            if(loadingElm)loadingElm.style.display='none';
            return;
        }
        // カレンダーの作成回数を増やす
        currentIndex++;
    }catch(e){
        console.error(e);
    }finally{
        // エラー回避用
        isLoading = false;
        if (loadingElm) loadingElm.style.display = 'none';
    }
}

function checkScroll(){
    // 各種画面サイズを取得
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.clientHeight;
    // 画面下から100px以内だと次のデータをロード
    if (scrollHeight-scrollTop-windowHeight <900){
        scroller();
        addPlanEvent();
    }
}

//Jsonデータの読み込み
async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}

// 予定の追加とイベントを追加する
async function addPlanEvent(){
    // 予定追加用の配列を初期化
    const str = [];
    // データを読み込む
    const datas = await readJson();
    console.log(datas);
    // dataの時系列を並び替え
    datas.sort((a, b) =>
        a.date > b.date ? 1 : -1  
        );
    console.log(datas);
    //　予定一覧を作成
    for (const data of datas){
        // 背景色変更用のボタンを取得
        const Elm = document.getElementById(`${data.date}`)
        if (Elm != undefined){
            // jsonデータのdateと比較用のnowDateを定義
            const nowDate = now.getFullYear().toString()+"-"+(now.getMonth()+1).toString().padStart(2,'0')+"-"+(now.getDate()).toString().padStart(2,'0')
            // 追加予定の日付が今日の場合背景色は紫にそうじゃなければ青色にする
            if (data.date != nowDate){
                // 今日ではない
                Elm.style.backgroundColor="blue";
            }else{
                // 今日の場合
                Elm.style.backgroundColor="mediumpurple"
            }
            // サイドバーに表示する予定の追加
            str.push(`
                <p class="plan${data.date}">${data.date} - ${data.time} - ${data.plan}</p><br>
                `)
            // サイドバーに表示する予定の背景色イベントの作成
            planEvent(data.date);
        }
    }
    // サイドバーに予定一覧を追加する
    const planElm = document.getElementById('planView');
    planElm.innerHTML = str.join("");
}

// 背景色が変更済みの要素を格納する変数
let planid=null;
// 予定がある日付を押すとサイドバーの予定一覧の背景色を変更する
function planEvent(id){
    // 予定がある日付の要素(button)を取得
    const btnElm = document.getElementById(`btn${id}`);
    // イベントを追加
    btnElm.addEventListener('click',()=>{
        console.log(planid);
        // すでに背景色が変更されている場合、背景色をもとに戻す
        if (planid != null){
            // すでに背景色が変更済みの要素を取得
            const prePlanElms = document.getElementsByClassName(`plan${planid}`);
            // 背景色を白に戻す
            for (const planElm of prePlanElms){
                planElm.style.backgroundColor="white";
            }
        }
        console.log("btn>event")
        // 押された日付の予定の背景色を変更する
        // 押された日付の予定の要素を取得
        const planElms = document.getElementsByClassName(`plan${id}`);
        // 押された日付の予定の背景色を緑に変更する
        for (const planElm of planElms){
            planElm.style.backgroundColor="lawngreen";
        }
        // 変更した予定のidをグローバル変数に格納
        planid = id;
    });
}

// 無限スクロール用のイベントを定義
window.addEventListener('scroll',()=>{
    console.log('addevent scroll');
    checkScroll();
});

try{
    // 最初はスクロールしないので仮で呼び出す
    checkScroll();
    addPlanEvent();
    // カレンダーの今日の日付の背景色を赤に変更
    document.getElementById(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${(now.getDate()).toString().padStart(2,'0')}`).style.backgroundColor="red";
}catch (e){
    console.error(e);
}

// 参考
// >>Dateの使い方
// https://iifx.dev/ja/articles/662145/%E7%9F%A5%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%8F%E3%81%A8%E4%BE%BF%E5%88%A9-javascript%E3%81%A7%E3%81%AE%E6%9C%88%E6%9C%AB%E6%97%A5%E8%A8%88%E7%AE%97%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF%E3%81%A8%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%90%BD%E3%81%A8%E3%81%97%E7%A9%B4

