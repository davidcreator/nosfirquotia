<?php
function translate($key, $lang_data) {
    return isset($lang_data[$key]) ? $lang_data[$key] : $key;
}
