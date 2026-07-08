//Jsonデータの読み込み
async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}

// tableに追加
async function appendEvent(){
    const str = [];
    const datas = await readJson();
    const tableElm = document.getElementById('planlist');
    console.log(datas);
    // dataの時系列を並び替え
    datas.sort((a, b) =>
        a.date > b.date ? 1 : -1  
        );
    console.log(datas);
    str.push(`<tr><th class="table_datetime">datetime</th><th>comment</th></tr>`)
    for (const data of datas){
        str.push(`
            <form>
                <tr class="plan${data.date}d">
                    <td class="table_datetime">${data.date} - ${data.time}</td>
                    <td>${data.plan}</td>
                    <td><button id="btn${data.date}-${data.time}">削除</button>
                </tr>
            </form>
            `)
        }
    tableElm.innerHTML = str.join("");
    addevent(datas);
}

function addevent(datas){
    for (const data of datas){
        const Elm = document.getElementById(`btn${data.date}-${data.time}`);
        console.log(`btn${data.date}-${data.time}`);
        Elm.addEventListener("click",()=>{
            console.log(`${data.date}-${data.time}`);
            postdata(data.date,data.time);
        });
    }
}

function postdata(delDate,delTime){
    fetch('/del', {
            // postでサーバーに送る
            method: 'POST',
            // Json形式で送る
            headers: {
                'Content-Type': 'application/json'
            },
            // Json形式に変更
            body: JSON.stringify({
                date: delDate,
                time: delTime,
                plan: ""
            })
        })
    // 強制リロード
    window.location.reload(true);
}

appendEvent();