<?php
$root = getcwd();
$port = random_int(19080,19999);
$sessionPath = str_replace('\\', '/', $root . '/storage/sessions');
if (!is_dir($sessionPath)) { mkdir($sessionPath, 0775, true); }
$cmd = [PHP_BINARY, '-d', 'session.save_path=' . $sessionPath, '-S', '127.0.0.1:' . $port, 'tests/http_router.php'];
$des = [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']];
$p = proc_open($cmd, $des, $pipes, $root);
if (!is_resource($p)) { fwrite(STDERR, "proc_open fail\n"); exit(1);} 
stream_set_blocking($pipes[1], false); stream_set_blocking($pipes[2], false);
$ready=false; $deadline = microtime(true)+8;
while (microtime(true)<$deadline){ $s=@fsockopen('127.0.0.1',$port,$e,$es,0.2); if(is_resource($s)){fclose($s); $ready=true; break;} usleep(100000);} 
if(!$ready){ echo "not ready\n"; proc_terminate($p); exit(1);} 

function req($method,$url,$headers=[],$body=''){
    $ctx=stream_context_create(['http'=>['method'=>strtoupper($method),'header'=>implode("\r\n",$headers),'content'=>$body,'ignore_errors'=>true,'follow_location'=>0,'max_redirects'=>0,'timeout'=>10]]);
    $resp=@file_get_contents($url,false,$ctx);
    $hdrs=$http_response_header??[];
    $status=0; $parsed=[];
    foreach($hdrs as $i=>$line){
        if($i===0){ if(preg_match('/\s(\d{3})\s/',$line,$m)) $status=(int)$m[1]; continue; }
        $parts=explode(':',$line,2); if(count($parts)!==2) continue;
        $parsed[strtolower(trim($parts[0]))]=trim($parts[1]);
    }
    return ['status'=>$status,'headers'=>$parsed,'body'=>is_string($resp)?$resp:''];
}
function tok($html){ return preg_match('/name="_csrf_token"\s+value="([^"]+)"/',$html,$m)?trim($m[1]):''; }
function cookie($headers){ $raw=$headers['set-cookie']??''; if(!$raw) return ''; return trim(explode(';',$raw,2)[0]??''); }

$base='http://127.0.0.1:'.$port;
$r1=req('GET',$base.'/cliente/login');
echo "GET /cliente/login status={$r1['status']} cookie=".cookie($r1['headers'])." tokenlen=".strlen(tok($r1['body']))."\n";
$csrf=tok($r1['body']);
$ck=cookie($r1['headers']);
$r2=req('POST',$base.'/orcamento/enviar',['Content-Type: application/x-www-form-urlencoded','Cookie: '.$ck],http_build_query(['_csrf_token'=>$csrf,'project_title'=>'Teste']));
echo "POST /orcamento/enviar status={$r2['status']} location=".($r2['headers']['location']??'')." bodylen=".strlen($r2['body'])."\n";

$out=stream_get_contents($pipes[1]); $err=stream_get_contents($pipes[2]);
if($out!==''){ echo "STDOUT:\n$out\n"; }
if($err!==''){ echo "STDERR:\n$err\n"; }
proc_terminate($p);
foreach($pipes as $pp){ if(is_resource($pp)) fclose($pp);} 
proc_close($p);
