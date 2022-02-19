<?php

// get key value
function parse_key_value(&$data, &$line) {
    $pos = intval(strpos($line,"="));
    $data[substr($line, 0, $pos)] = substr($line, $pos+1, strlen($line) - $pos - 2);
}

// eval date passed
function has_date_passed($last_update, $seconds) {
    $cur = time();
    $last = strtotime($last_update);
    if (floor(abs($cur-$last) / intval($seconds)) > 0) return true;
    return false;
}

// load data from file
function load_data() {
    $data = [];
    $filename = 'data.txt';
    $file = fopen($filename, 'r');
    while (!feof($file)) {
        $aux = fgets($file);
        if (strpos($aux, 'WORDS') > 0) break;
        parse_key_value($data, $aux);
    }
    if (has_date_passed($data['LAST_UPDATE'] . $data['TIME_CHANGE'], $data['SECONDS_TILL_UPDATE'])) {
        $data['LAST_UPDATE'] = date('Y-m-d');
        $words = fgets($file);
        $data['CURRENT_WORD'] = substr($words, 0, 5);
        $cache = '';
        foreach($data as $key => $value) $cache .= "$key=$value\n";
        $cache .= "-WORDS\n" . substr($words, 6, strlen($words));
        fclose($file);
        $file = fopen($filename, 'w');
        fwrite($file, $cache);
    }
    fclose($file);
    return $data;
}
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode(load_data());
?>