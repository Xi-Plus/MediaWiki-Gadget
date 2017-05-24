<?php
header('Access-Control-Allow-Origin: *');
$res = array("status" => true, "result" => "");
$url = "https://tools.wmflabs.org/templatecount/index.php?lang=zh&namespace=".$_GET["namespace"]."&name=".urlencode($_GET["title"]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36");
curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
$html = curl_exec($ch);
curl_close($ch);

if ($html === false) {
	$res["status"] = false;
	$res["result"] = "fetch";
} else if (preg_match("/<p>(\d+) transclusion\(s\) found\.<\/p>/", $html, $m)) {
	$res["result"] = $m[1];
} else {
	$res["status"] = false;
	$res["result"] = "match";
}
echo json_encode($res);
