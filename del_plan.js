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
            <tr class="plan${data.date}d"><td class="table_datetime">${data.date} - ${data.time}</td><td>${data.plan}</td></tr>
            `)
        }
    tableElm.innerHTML = str.join("");
}

appendEvent();