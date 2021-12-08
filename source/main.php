<!DOCTYPE HTML>
<html lang="ja">
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css">
    <title>GAME</title>
</head>

<body>
    <?php
    $s_num = $_POST['stage'];
    if($s_num == -1){
        $s_num = 0;
        $p_num = -1;
    }
    else{
        $p_num = 1;
    }

    $s_num_json = json_encode($s_num);
    $p_num_json = json_encode($p_num);
    ?>

    <script type="text/javascript">
        let stage_num = Number(JSON.parse('<?php echo $s_num_json; ?>'));
        let page = Number(JSON.parse('<?php echo $p_num_json; ?>'));
        console.log(stage_num);
    </script>

    <script type="text/javascript" src="code.js"></script>
</body>