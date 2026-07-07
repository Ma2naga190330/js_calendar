// 1月ごとのカレンダーを表示する
function cale(now){
    // currentIndexから年と月の差を取得
    let [curYear,curMon] = numToMonth();
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
function dispCale(now){
    // 日付一覧を取得
    const str = cale(now);
    // index.htmlの要素を取得
    const monElm = document.getElementById('month');
    const Elm = document.querySelector('.cale');
    // カレンダー(日付一覧)を代入
    Elm.innerHTML=str.join("");
    // カレンダーの見出しの年月を代入
    monElm.innerHTML = (now.getFullYear())+"年"+(now.getMonth()+1).toString()+"月";
    // 現在の日付の文字を赤にする
    
    const nowDate = document.getElementById(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${(now.getDate()).toString().padStart(2,'0')}`).style.backgroundColor="red";
}
function numToMonth(){
    if (currentIndex === 0){
        return [0,0];
    }else{
        // 月の差分と月のあまりを返す
        return [Math.floor((now.getMonth()+currentIndex)/12),(now.getMonth()+currentIndex)%12-now.getMonth()];
    }
}

// スクロールで使用するグローバル変数
let isLoading = false;
let currentIndex = 0;
const now = new Date();
// スクロール
async function scroller(){
    // エラー回避
    if (isLoading) return;
    isLoading = true;
    const loadingElm = document.getElementById('loading');
    if (loadingElm) loadingElm.style.display = 'block';
    try{
        currentIndex++;
        const str = cale(now);
        // タイムラインを取得
        const timeline = document.getElementById('timeline');
        // 要素の作成
        const postElm = document.createElement('div');
        postElm.className='post';
        let [curYear,curMon] = numToMonth();
        postElm.innerHTML=`<h3>${now.getFullYear()+curYear}年${now.getMonth()+curMon+1}月</h3><table border="1">${str.join("")}</table>`;
        timeline.appendChild(postElm);
        if (currentIndex === 24){
            isLoading = false;
            if(loadingElm)loadingElm.style.display='none';
            return;
        }
    }catch(e){
        console.error(e);
    }finally{
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
    if (scrollHeight-scrollTop-windowHeight <100){
        scroller();
    }
}

async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}

async function appendEvent(){
    const str = [];
    const datas = await readJson();
    console.log(datas);
    // dataの時系列を並び替え
    datas.sort((a, b) =>
        a.date > b.date ? 1 : -1  
        );
    console.log(datas);
    for (const data of datas){
        const Elm = document.getElementById(`${data.date}`)
        if (Elm != undefined){
            const nowDate = now.getFullYear().toString()+"-"+(now.getMonth()+1).toString().padStart(2,'0')+"-"+(now.getDate()).toString().padStart(2,'0')
            if (data.date != nowDate){
                Elm.style.backgroundColor="blue";
            }else{
                Elm.style.backgroundColor="mediumpurple"
            }
            str.push(`
                <p class="plan${data.date}">${data.date} - ${data.time} - ${data.plan}</p><br>
                `)
            await planEvent(data.date);
        }
    }
    const planElm = document.getElementById('planView');
    planElm.innerHTML = str.join("");
}

const planFlag=false;
let planid=null;
// sidebarの背景色変更
function planEvent(id){
    // console.log(id)
    const btnElm = document.getElementById(`btn${id}`);
    btnElm.addEventListener('click',()=>{
        console.log(planid);
        if (planid != null){
            const prePlanElms = document.getElementsByClassName(`plan${planid}`);
            for (const planElm of prePlanElms){
                planElm.style.backgroundColor="white";
            }
        }
        console.log("btn>event")
        const planElms = document.getElementsByClassName(`plan${id}`);
        for (const planElm of planElms){
            planElm.style.backgroundColor="lawngreen";
        }
        planid = id;
    });
}

window.addEventListener('scroll',()=>{
    console.log('addevent scroll');
    checkScroll();
});

dispCale(now);
checkScroll();
appendEvent();
// 参考
// >>Dateの使い方
// https://iifx.dev/ja/articles/662145/%E7%9F%A5%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%8F%E3%81%A8%E4%BE%BF%E5%88%A9-javascript%E3%81%A7%E3%81%AE%E6%9C%88%E6%9C%AB%E6%97%A5%E8%A8%88%E7%AE%97%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF%E3%81%A8%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%90%BD%E3%81%A8%E3%81%97%E7%A9%B4

