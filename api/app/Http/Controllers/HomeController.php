<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function get_list(){
        $rtn=[];
        $client = new \GuzzleHttp\Client();
        $response = $client->get("https://api.geni.us:443/v1/links/list?numberoflinks=500000&format=json", [
            'headers' => [
                'X-Api-Key' => env('GENIUSLINK_KEY'),
                'X-Api-Secret' => env('GENIUSLINK_SECRET')
            ]
        ]);

        if ($response->getStatusCode()=='200') {
            $body = json_decode($response->getBody(), true);
            $rtn = $body;
        }
        return $rtn;

    }

    public function post_link(Request $request){
        $rtn=[];
        $client = new \GuzzleHttp\Client();
        $url = $request->input('url');

        $response = $client->post("https://api.geni.us:443/v2/shorturl?format=json", [
            'headers' => [
                'X-Api-Key' => env('GENIUSLINK_KEY'),
                'X-Api-Secret' => env('GENIUSLINK_SECRET')
            ],
            'form_params' => [
                'Url' => $url,
                'GroupId' => env('GENIUSLINK_GROUPID')
            ]
        ]);

        if ($response->getStatusCode()=='200') {
            $body = json_decode($response->getBody(), true);
            $rtn = $body;
        }
        return $rtn;
    }
}
