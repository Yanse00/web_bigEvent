$(function() {
    // 定义一个查询的参数对象  将来请求数据时候
    // 需要将请求参数对象提交到服务器

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)

        var y = Zero(dt.getFullYear())
        var m = Zero(dt.getMonth() + 1)
        var d = Zero(dt.getDate())

        var hh = Zero(dt.getHours())
        var mm = Zero(dt.getMinutes())
        var ss = Zero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function Zero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    };

    initTable();

    initCate();
    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status) {
                    return layer.msg('获取文章失败')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total);
            }

        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通知layui 重新渲染表单区域的内容
                form.render();

            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件 重新渲染表格的数据
        initTable();

    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时候 触发jump
            // 触发jump回调函数的方式有两种
            // 1.点击页码值的时候 会触发jump回调 (first返回underfine)
            // 2.点击调用了 laypage.render()就会触发jump回调 (死循环的原因)
            // laypage.render()触发 (first返回true)
            jump: function(obj, first) {
                // 可以通过first的值 来判断是通过哪种方式触发的jump
                console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值 赋值给q这个参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值给q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表 并渲染数据
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过代理的方式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
            // console.log('ok');
            // 询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功!')

                    // 当数据删除完成后 需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据 就让页码值-1之后再重新调用initTable()
                    if (len === 1) {

                        // 如果len的值等于1  证明删除完毕之后,页面上就没有任何数据显示
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }

            })

            layer.close(index);
        });
    })

})