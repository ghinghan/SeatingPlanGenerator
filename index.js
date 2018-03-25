	
var outString = null;

function addReservedNum() {
	var row = document.getElementById('row').value;
  var column = document.getElementById('column').value;
  var start = document.getElementById('startNum').value;
  var end = document.getElementById('endNum').value;
	if(!isValidData1(row,column,start,end)){
  	alert('座位數量或起始/結束座號輸入錯誤!! 輸入正確前無法新增預選座位!!');
  	return;
  }
  
	var rowNum = document.getElementById("seatingTable").rows.length;
	if(rowNum > row*column+5){
		alert("無法再新增預選座位!!");
		return;
	}
	
	var tr = document.getElementById("seatingTable").insertRow(rowNum-2);
	var td = tr.insertCell(tr.cells.length);
	var content = "(非必填)預選座位" + (rowNum-5) + "：(第幾排,第幾個,座號.  空位請輸入座號0. Ex: 2,1,10)<input type='text' name='reservedNum' id='reservedNum' />";
 	td.innerHTML = content;
 	td.colSpan = "2";
}

function removeReservedNum() {
	var rowNum = document.getElementById("seatingTable").rows.length;
	if(rowNum > 7) {
		document.getElementById("seatingTable").deleteRow(rowNum-3);
	}else
		alert("若無需輸入預選座位,保留空白即可");
}

function processFormData() {
  var row = document.getElementById('row').value;
  var column = document.getElementById('column').value;
  var start = document.getElementById('startNum').value;
  var end = document.getElementById('endNum').value;
  var emptyRaw = document.getElementById('emptyNums').value;
	var reservedRaw = document.getElementsByName('reservedNum');
	
  if(!isValidData1(row,column,start,end)){
  	alert('座位數量或起始/結束座號輸入錯誤!! 請重新輸入');
  	return;
  }
  
	var numList = handleEmptyNums(start, end, emptyRaw.split(','));
  
  var reservedNums = [];
  for(var i=0; i < reservedRaw.length ; i++){
  	var tmp = reservedRaw[i].value.split(',');
  	if(tmp == '')
  		continue;
  	
  	if(!isValidData2(tmp, column, row, numList)){
  		alert('預選座位資料輸入錯誤!! 請重新輸入');
  		return;
  	}else
  		reservedNums.push(tmp);
	}
	
  var outList = new Array();
  for(var i=0; i < row ; i++){
  	let tmp = new Array();
  	for(var j=0; j < column ; j++)
  		tmp.push(-1);
  	outList.push(tmp);
  }
  
  for(var i=0 ; i < reservedNums.length ; i++){
  	var reservedSeat = reservedNums[i];
  	var reservedColumn = parseInt(reservedSeat[0],10)-1;
  	var reservedRow = parseInt(reservedSeat[1],10)-1;
  	var reservedNum = parseInt(reservedSeat[2],10);
  	outList[reservedRow][reservedColumn] = reservedNum;
  	if(reservedNum != 0)
  		numList.splice(numList.indexOf(reservedNum), 1);
  }
  
  for(var i=0; i < outList.length ; i++){
  	for(var j=0; j < outList[i].length ; j++){
  		if(outList[i][j] === -1){
  			if(numList.length == 0)
  				break;
  			var randomIndex = Math.floor(Math.random() * numList.length);
  			outList[i][j] = numList[randomIndex];
  			numList.splice(randomIndex,1);
  		}
  	}
  }
  
  var table = document.getElementById("outputTable");
	table.innerHTML = "";
  var tr = document.createElement('tr');   
  var td_header = document.createElement('td');
  td_header.colSpan = column.toString();
  td_header.innerHTML = "黑板";
  td_header.style.textAlign = "center";
  tr.appendChild(td_header);
  table.appendChild(tr);
  
  outString = "\uFEFF";
  for(var m=0; m < column; m++){
  	if(m < Math.floor(column/2) || m > Math.floor(column/2))
  		outString = outString.concat(',');
  	else
  		outString = outString.concat('黑板');
  }
  outString = outString.concat('\n');
  
  for(var i=0; i < outList.length ; i++){
  	var newTr = document.createElement("tr");
  	for(var j=0; j < outList[i].length ; j++){
			var td = document.createElement('td');
			if(outList[i][j] <= 0){
				td.innerHTML = "空位";
				outString = outString.concat("空位");
			}else{
  			td.innerHTML = outList[i][j].toString();
  			outString = outString.concat(outList[i][j].toString());
  		}
  		td.style.textAlign = "right";
  		newTr.appendChild(td);
  		if(j != outList[i].length-1)
  			outString = outString.concat(",");
  	}
		table.appendChild(newTr);
		outString = outString.concat("\n");
  }
  
  var tr_footer = document.createElement("tr");
  var td_footer = document.createElement('td');
  td_footer.innerHTML = '<input type="button" id="downloadButton" value="存檔" onclick="download()">';
  td_footer.colSpan = column.toString();
  td_footer.style.textAlign = "center";
  tr_footer.appendChild(td_footer);
  table.appendChild(tr_footer);
}

function isValidData1(row, column, start, end){
	return !(isNaN(row) || isNaN(column) || isNaN(start) || isNaN(end) || row <= 0 || column <= 0 || start <= 0 || end <= start || (end-start-1) > row*column);
}

function isValidData2(nums, column, row, numList){
	if(nums.length != 3)
		return false;
		
	for(var i=0; i < nums.length ; i++){
		if(nums[i] == '' || isNaN(nums[i]))
			return false;
	}
	
	return !(nums[0] <= 0 || nums[1] <=0 || nums[0] > column || nums[1] > row || nums[2] < 0 || (nums[2] != 0 && numList.indexOf(parseInt(nums[2])) == -1))
}

function handleEmptyNums(start, end, emptyRaw){
	var numList = new Array(end-start+1);
	for(var i = start ; i <= end ; i++){
		numList[i-1] = i;
	}
	
	for(var j = 0; j < emptyRaw.length ; j++){
		if(!isNaN(emptyRaw[j]) && emptyRaw[j] !== ''){
			var index = numList.indexOf(parseInt(emptyRaw[j],10));
			if(index > -1)
				numList.splice(index, 1);
		}
	}
	return numList;
}

function download() {
  var element = document.createElement('a');
  const MIME_TYPE = 'text/csv';
  var blob = new Blob([outString], {
    type: MIME_TYPE
  });
  var blobUrl = window.URL.createObjectURL(blob);
  element.setAttribute('href', blobUrl);
  element.setAttribute('download', "seatingplan.csv");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}