# waterFall
js实现的网页瀑布流效果，该插件的特点是能够使子元素等宽或者等间隔分布在设定大小的父元素内，使用灵活、方便

	//固定子元素宽度，使每行尽可能多的排列子元素
		var water1 = waterFall( {
			$par: $( '.parent1' ),//瀑布流的父元素，向其中添加元素
		    perWidth: 270,//每个子元素的宽度
		    $children: $('.parent1 .child'),//需要进行布局处理的jquery子元素
		    rowSpace: 100, //每行之间的间隔
		} );
		//固定子元素每行间隔，元素大小可变，尽可能填满父元素，需要给最小宽度
		var water2 = waterFall( {
			$par: $( '.parent2' ),//瀑布流的父元素，向其中添加元素
		    minWidth: 270,//每个子元素的宽度
		    $children: $('.parent2 .child'),//需要进行布局处理的jquery子元素
		    space: 20 //两列之间的间隙
		} );
