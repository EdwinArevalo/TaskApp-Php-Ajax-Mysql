$(document).ready(function(){
    console.log('Jqueryis working');

    let edit = false;

    $('#task-result').hide();
    fetchTasks();

    $('#search').keyup(function(e){
        
       if($('#search').val()){

            let search = $('#search').val();
            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data: { search },
                success: function(response){
                    let tasks = JSON.parse(response);
                    template = '';
                    tasks.forEach(task => {
                        template+= `<li>${task.name}</li>`;
                    });

                    console.log(tasks);
                    $('#container').html(template);
                    $('#task-result').show();  
                }
            });
       }else{
        $('#task-result').hide();
       }

    });

    $('#task-form').submit(function(e){
        
        const posData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        }

        let url = edit === false ? 'task-add.php' : 'task-edit.php';
        edit = false;

        $.post(url,posData, function(response){
            console.log(response);
            fetchTasks();
            $('#task-form').trigger('reset');
        });
        
        e.preventDefault();
    });

    function fetchTasks(){
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response){
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                    <tr taskId="${task.id}">
                        <td>${task.id}</td>
                        <td>
                            <a href="#" class="task-item"> ${task.name}</a>
                        </td>
                        <td>${task.description}</td>
                        <td>
                            <button class="task-delete btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                    `;
                });
    
                $('#tasks').html(template);
    
            }
        });
    }


    $(document).on('click','.task-delete', function(){
        if(confirm("Are you sure to delete it?")){
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php',{id},function(response){
                fetchTasks();
                console.log(response);
        });
        }
    });


    $(document).on('click','.task-item', function(){
        let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-single.php',{id},function(response){
                const task = JSON.parse(response);
                $('#name').val(task.name);
                $('#description').val(task.description);
                $('#taskId').val(task.id);
                edit = true;
                console.log(task);
        });
    });


});