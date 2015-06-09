
  $(document).ready(function() {
	  // 表格分页设置
	  	$('#logtable').bootstrapTable({
	  		url : "manage/logtable",
	  		sortName : "update_time",
	  		sortOrder: "desc",
	  		pageList: "[10, 25, 50, 100, All]",
	  		queryParams: function(p){
	  			return {
	  				proj : pid,
	  				limit: p.limit,
	  				offset : p.offset,
	  				sort: p.sort,
	  				order: p.order
	  			}
	  		}
	  	});
	  	

	  	
    } );
  
  

	
  $('#logtable').on('check.bs.table uncheck.bs.table ' +
            'check-all.bs.table uncheck-all.bs.table', function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        // save your data, here just save the current page
        selections = getIdSelections();
        // push or splice the selections if you want to save all data selections
    });
  
  // 获取表格选择的所有ids
  function getIdSelections() {
      return $.map($('#logtable').bootstrapTable('getSelections'), function (row) {
          return row.id
      });
  }
  
  

  // 删除日志源+二次确认
	function delete_logsrc(){
	  	  var ids = getIdSelections(); //待删除id数组
		  var ids_str = ids.toString();  //待删除id字符串
		  // 用户没有勾选内容
		  if(ids_str == "" ){
			  $("#js_notice").html("<font color='red'>  请勾选需要删除的日志源</font></br>");
		  }
		  else{
			  $("#js_notice").html("");
				 $('#ids').val(ids_str);  //post请求参数 ids
				 $('#proj').val(pid);  //post请求参数 projj
				$('#destroy_logsrc_modal').modal('show');  //弹窗modal
		  }

	}

	
	
//      //  删除日志源
//      function destroyLogsrc(){
//          var ids = getIdSelections();
//         // console.log(ids); //tmp log
//          $('#logtable').bootstrapTable('remove', {
//              field: 'id',
//              values: ids
//          });
//      	$.ajax({
//      		type: 'POST',
//    		url: '/logsrc/destroy',
//    		data:{ ids: ids.toString(),
//    					proj: pid},
//    		success :function(data){
//    			$('#result').html(data);
//    		}
//    	})
//      }
//      
      
      // 开始监控
      function startMonitorLogsrc(){
    	  var ids = getIdSelections();
    	  var ids_str = ids.toString();
    	  if(ids_str==""){
    		  $("#js_notice").html("<font color='red'>  请勾选需要开始监控的日志源</font></br>");
    	  }else{
    		  // send ajax 
    	      	$.ajax({
    	      		type: 'POST',
    	    		url: '/logsrc/start_monitor',
    	    		data:{ ids: ids_str},
    	    		success :function(e){
    	    			 if(e['status'] == 0 ) { //开始监控成功
    	    				 location.reload() ;
    	    			 }
    	    			 else{
    	    				 $("#js_notice").html("<font color='color'> "+e['message']+"</font></br>");
    	    			 }
    	    		}
    	    	}) ;  //--ajax--  		  
    	  }	//--else--  		
      }
      
      // 停止监控
      function stopMonitorLogsrc(){
    	  var ids = getIdSelections();
    	  var ids_str = ids.toString();
    	  if(ids_str==""){
    		  $("#js_notice").html("<font color='red'>  请勾选需要停止监控的日志源</font></br>");
    	  }else{
    		  // send ajax 
    	      	$.ajax({
    	      		type: 'POST',
    	    		url: '/logsrc/stop_monitor',
    	    		data:{ ids: ids_str},
    	    		success :function(e){
    	    			 if(e['status'] == 0 ) { //开始监控成功
    	    				 location.reload() ;
    	    			 }
    	    			 else{
    	    				 $("#js_notice").html("<font color='color'> "+e['message']+"</font></br>");
    	    			 }
    	    		}
    	    	}) ;  //--ajax--  		  
    	  }	//--else--  		
      }      
      
      
      
      
  function logsrcnameFormatter(value, row, index) {
//	  console.log(value);
//	  console.log(row);
//	  console.log(index);
	//  console.log(row.id);
	  
	  if(row.id==undefined){
		return "-";	  
	  }
	  
	  return  '<a class="like" href="/logsrc/' + row.id + '?proj=' + pid + '" >' + value + '</a>';
		  
	  //return   '<a class="like" href="1?‘’proj='+pid + '" >' + value + '</a>';
  }
  
  function statusFormatter(value, row, index){
	  
	  if(row.id==undefined){
		return "-";	  
	  }
	  
	  
	  if (value==0){
		  return '未开始'
	  }
	  else if(value == 1){
		  return '<font color="red">监控中</red>'
	  }
	  else if(value == 2){
		  return '监控结束'
	  }	  
	  else{
		  return '其他'
	  }
  }

  function operateFormatter(value, row, index){

	  if(row.id==undefined){
			return "-";	  
		  }
	  else{
		  return [
		          // 调试功能
	//	            '<a class="debug" href="javascript:void(0)" title="调试" disabled>',
	//	            '<i class="glyphicon glyphicon-cog"></i>',
	//	            '</a>  ',
		          	// 复制日志源功能
//		            '<a class="copy" href="javascript:void(0)"  title="复制"  onclick=logsrc_copy('+row.id+')>',
//		            '<i class="glyphicon glyphicon-file"></i>',
//		            '</a>  ',	            
		            // 编辑日志源功能
		           '<a class="edit" href="' + row.id + '/edit?proj=' + pid + '" >',
		            '<i class="glyphicon glyphicon-edit"></i>',
		            '</a>'
		        ].join('');
	  }
  }

  
//  // 复制日志源
//  function logsrc_copy(logsrcid){
//	  console.log(logsrcid)
//	  $('#copy_logsrc_id').val(logsrcid);
//	  $("#copy_logsrc_modal").modal('show');
//  }
    

//function test(){
//	$.ajax({
//		url: '/api/logsource/1',
//		success :function(data){
//			$('#result').html(data);
//		}
//	})
//}


