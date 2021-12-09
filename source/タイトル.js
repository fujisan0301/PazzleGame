$(function() {

	// ボタンをクリックしたとき
	$('#button').click(function(e) {
		  e.preventDefault();
	  
	  // ボタンを押して5秒後に結果ページへ遷移
	  var TransitionDelay = function(){
		    var form = document.createElement('form');
			var request = document.createElement('input');
 
			form.method = 'POST';
			form.action = 'main.php';
 
			request.type = 'hidden';
			request.name = 'stage';
			request.value = -1;
 
			form.appendChild(request);
			document.body.appendChild(form);
 
			form.submit();
	  }
	  setTimeout ( TransitionDelay, 400 );
  
	});
  });
  $(function() {

	// ボタンをクリックしたとき
	$('#button2').click(function(e) {
		  e.preventDefault();
	  
	  // ボタンを押して5秒後に結果ページへ遷移
	  var TransitionDelay = function(){
		  window.location.href = 'stageselect.html';
	  }
	  setTimeout ( TransitionDelay, 400 );
  
	});
  });

function sound()
{
	// 対象となるID名
	var id = 'sound-file' ;

	// 初回以外だったら音声ファイルを巻き戻す
	if( typeof( document.getElementById( id ).currentTime ) != 'undefined' )
	{
		document.getElementById( id ).currentTime = 0;
	}

	// [ID:sound-file]の音声ファイルを再生[play()]する
	document.getElementById( id ).play() ;
}