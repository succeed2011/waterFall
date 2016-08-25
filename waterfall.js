
/*
 * @input:options = {
    $par: //瀑布流的父元素，向其中添加元素
    perWidth: //每个子元素的宽度
    $children: //需要进行布局处理的jquery子元素
    rowSpace: //两行之间的间隔
 }
 * @output: WaterFall对象
*/
function waterFall( options ) {
    var option, returnObj,
        defaultOpt = {
            $par: null,
            perWidth: 0,
            $children: null,
            space: 0,
            rowSpace: 10,
            minWidth: 0
        };

    option = $.extend( defaultOpt, options );

    function WaterFall( $par, perWidth, $children ) {

        this.colsHeight = [];
        this.children = [];

        this.$par = $par;
        this.perWidth = option.perWidth;
       
        //初始化
        this.init( $children );
    }

    WaterFall.prototype.init = function( $children ) {
        var that = this;

        this.getPos();

        this.append( $children );
    }

    //计算瀑布流列数，间距，首列距左侧距离
    WaterFall.prototype.getPos = function() {
        var i, len, pos;

        if( option.perWidth !== 0 ) {
            //固定宽度
            pos = widthFixed(  this.$par.width(), option.perWidth );
        } else if( option.space !== 0 ) {
            //固定间隙和最小宽度

            pos = spaceFixed( this.$par.width(), option.space, option.minWidth );
        }

        this.space = pos.space || option.space;
        this.perWidth = pos.perWidth || option.perWidth;
        this.cols = pos.cols;
        this.left = pos.left;

        this.colsHeight = [];

        for( i = 0; i < this.cols; i++ ) {
            this.colsHeight[ i ] = 0;
        }
    }

    //向对象中追加元素，输入为jquery对象
    WaterFall.prototype._append = function( children ) {
        var childHeight, i, len, minObj,
            that = this;

        //遍历子元素，计算子元素定位位置
        for( i = 0, len = children.length; i < len; i++ ) {

            this.$par.append( children[ i ] );

            childHeight = children[ i ].innerHeight();

            //获取最短列和索引
            minObj = getMinElem( this.colsHeight );

            children[ i ].css( {
                top: minObj.value + 'px',
                left: that.left + ( that.perWidth + that.space ) * minObj.index + 'px',
                width: that.perWidth + 'px'
            } );

            this.colsHeight[ minObj.index ] += childHeight + option.rowSpace;
        }

        this.$par.css( 'height', Math.max.apply( '', this.colsHeight ) + 'px' );

        return this;
    }

    //向对象中追加元素，输入为jquery对象
    WaterFall.prototype.append = function( children ) {
        var childrenArray = [],
            that = this;

        if( !children ) {
            return this;
        }

        if( $.type( children ) === 'array' ) {
            this.children = this.children.concat( children );
            this._append( children );
        } else {
            children.each( function( _, elem ) {
                that.children.push( $( elem ) );
                childrenArray.push( $( elem ) );
            } );

            this._append( childrenArray );
        }

        return this;
    }

    //普通刷新，重新计算位置，重新排列子元素
    WaterFall.prototype.fresh = function() {
        this.getPos();
        this._append( this.children );

        return this;
    }

    //强制刷新，清空children对象，重新计算位置
    WaterFall.prototype.clear = function() {
        this.getPos();
        this.children = [];
        this.$par.empty().css( 'height', 0 );

        return this;
    }

    //计算数组中最小元素及其索引
    function getMinElem( src ) {
        var i, len,
            index = 0,
            min = src[ 0 ];

        for( i = 0, len = src.length; i < len; i++ ) {
            if( min > src[ i ] ) {
                index = i;
                min = src[ i ];
            }
        }

        return {
            index: index,
            value: min
        }
    }


    //固定列宽，间隙可变
    //计算瀑布流的列数，第一列距离左侧的距离，以及每列之间的间隔
    function widthFixed( totalWidth, perWidth ) {
        var nSideSpace, nNormal,

            //最终的列数
            n,

            space = 0,

            //第一列距离左侧的距离
            left;

        nNormal = parseInt( ( totalWidth + space ) / ( perWidth + space ), 10 );
        nSideSpace = parseInt( ( totalWidth - space ) / ( perWidth + space ), 10 );

        //console.log(nNormal === nSideSpace)
        //相等说明在左右两侧加上空白也不会影响到最终列数，为了使布局居中
        if( nNormal === nSideSpace ) {
            n = nSideSpace;
            space = parseInt( ( totalWidth + space - ( perWidth + space ) * n ) / ( n + 1 ), 10 ) + space;
            left = parseInt( ( totalWidth - ( perWidth * n + space * ( n + 1 ) ) ) / 2, 10 );

        } else {
            n = nNormal;
            space = parseInt( ( totalWidth + space - ( perWidth + space ) * n ) / ( n - 1 ), 10 ) + space;
            left = parseInt( ( totalWidth - ( perWidth * n + space * ( n - 1 ) ) ) / 2, 10 );
        }

        //总宽度小于等于每列的宽度或者总宽度等于两列宽度和
        if( n === 0 || n === 1 ) {
            n === 0 ? left = 0 : left = parseInt( ( totalWidth - perWidth ) / 2, 10 );
           
            return {
                cols: 1,
                space: 0,
                left: left
            }
        }

        return {
            cols: n,
            space: space,
            left: left + space
        }
    }

    //固定间隔，宽度可变，但是有一个最小宽度
    function spaceFixed( totalWidth, space, minWidth ) {
        var n,
            perWidth ,
            left;

        n = parseInt( ( totalWidth + space ) / ( minWidth + space ), 10 );
        perWidth = parseInt( ( totalWidth + space - ( minWidth + space ) * n ) / n, 10 ) + minWidth;
        left = parseInt( ( totalWidth + space - ( perWidth + space ) * n ) / 2, 10 );
       
        if( n === 0 ) {
            return {
                cols: 1,
                perWidth: minWidth,
                left: 0
            }
        }

        return {
            cols: n,
            perWidth: perWidth,
            left: left
        }
    }

    //创建瀑布流对象
    returnObj = new WaterFall( option.$par, option.perWidth, option.$children );

    return returnObj;
}


