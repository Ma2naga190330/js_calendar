function postValue(){
    const dateElm = document.getElementById('updateDate');
    const timeElm = document.getElementById('updateTime');
    const planElm = document.getElementById('updatePlan');

    dateElm.value="2026-06-23";
    timeElm.value="00:00";
    planElm.value="test"
}

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
    const ids = [];
    let id="";
    str.push(`<tr><th>datetime</th><th>comment</th></tr>`)
    for (const data of datas){
        id = "plan"+data.date+"-"+data.time;
        ids.push(id);
        str.push(`
            <form>
                <tr class="">
                    <td><input type="date" value="${data.date}" class="${id}"></td>
                    <td><input type="time" value="${data.time}" class="${id}"></td>
                    <td><input type="text" value="${data.plan}" class="${id}"></td>
                </tr>
            </form>
            `)
        }
    tableElm.innerHTML = str.join("");
    updateSubmit(ids);
    // addevent(datas);
}

// function addevent(datas){
//     for (const data of datas){
//         const Elm = document.getElementById(`btn${data.date}-${data.time}`);
//         console.log(`btn${data.date}-${data.time}`);
//         Elm.addEventListener("click",()=>{
            
//         });
//     }
// }

// function update(updateDate,updateTime,updatePlan){
//     fetch('/update', {
//             // postでサーバーに送る
//             method: 'POST',
//             // Json形式で送る
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             // Json形式に変更
//             body: JSON.stringify({
//                 date: updateDate,
//                 time: updateTime,
//                 plan: updatePlan
//             })
//         })
//         alert("更新成功");
//         // 強制リロード
//         window.location.reload(true);
// }

// 更新ボタン
function updateSubmit(ids){
    const submitElm = document.getElementById('update_submit');
    const updata = [];

    submitElm.addEventListener("click",async ()=>{
        console.log("update_submit");
        console.log("ids>>"+ids);
        for (id of ids){
            const Elm = document.getElementsByClassName(id);
            console.log(Elm);
            for (i=0;i<Elm.length;i+=3){

                updata.push({
                    date: Elm[i].value,
                    time: Elm[i+1].value,
                    plan: Elm[i+2].value
                })
            }
        }
        console.log("update"+updata[0].plan);
        await fetch('/upd', {
            // postでサーバーに送る
            method: 'POST',
            // Json形式で送る
            headers: {
                'Content-Type': 'application/json'
            },
            // Json形式に変更
            body: JSON.stringify(updata)
        })
        alert("追加成功");
        // 強制リロード
        // window.location.reload(true);
    });
}
// postValue();
appendEvent();