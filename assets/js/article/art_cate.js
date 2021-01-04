$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // 开启弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()

        })
    })

    //因为表单为动态生成的 通过代理形式 为form-add添加按钮 绑定submit事件
    // 添加文章分类列表
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        // console.log('ok');

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!')
                }

                initArtCateList();
                layer.msg('新增分类成功!')
                    // 根据所有关闭对应的索引层
                layer.close(indexAdd);
            }
        })
    })


    //因为表单为动态生成的 通过事件代理为btn-edit 编辑按钮绑定submit事件
    // 根据 Id 获取文章分类数据
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok');
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 根据 Id 获取文章分类数据
        var id = $(this).attr('data-Id');
        // 发起ajax请求获取Id对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 因为表单为动态生成的 通过事件代理为 form-edit修改分类的表单绑定submit事件
    // 根据 Id 更新文章分类数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过事件代理为删除按钮btn-delete绑定click事件
    // 根据 Id 删除文章分类
    $('tbody').on('click', '.btn-delete', function(e) {
        e.preventDefault();
        // console.log('ok');
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' },
            function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败')
                        }
                        layer.msg('删除分类成功')
                        layer.close(index);
                        initArtCateList();
                    }
                })


            });
    })
})