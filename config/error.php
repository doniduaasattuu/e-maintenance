<?php

return [
    'code' => [
        // Informational
        100 => [
            "title" => "Continue",
            "description" => "The server has received the request headers, and the client should proceed to send the request body.",
        ],
        101 => [
            "title" => "Switching Protocols",
            "description" => "The requester has asked the server to switch protocols, and the server is acknowledging that it will do so.",
        ],
        102 => [
            "title" => "Processing",
            "description" => "The server has received and is processing the request, but no response is available yet.",
        ],
        103 => [
            "title" => "Early Hints",
            "description" => "The server is likely to send a final response with the header fields included in the informational response.",
        ],

        // Successful
        200 => [
            "title" => "OK",
            "description" => "The request was successful.",
        ],
        201 => [
            "title" => "Created",
            "description" => "The request has been fulfilled, resulting in the creation of a new resource.",
        ],
        202 => [
            "title" => "Accepted",
            "description" => "The request has been accepted for processing, but the processing has not been completed.",
        ],
        203 => [
            "title" => "Non-Authoritative Information",
            "description" => "The server successfully processed the request, but is returning information that may be from another source.",
        ],
        204 => [
            "title" => "No Content",
            "description" => "The request was successful, but there is no content to return.",
        ],
        205 => [
            "title" => "Reset Content",
            "description" => "The server successfully processed the request and is instructing the client to reset the document view.",
        ],
        206 => [
            "title" => "No Content",
            "description" => "The request was successful, but there is no content to return.",
            // "title" => "Partial Content",
            // "description" => "The server is delivering only part of the resource due to a range header sent by the client.",
        ],
        207 => [
            "title" => "Multi-Status",
            "description" => "The message body contains multiple status codes for multiple independent operations.",
        ],
        208 => [
            "title" => "Already Reported",
            "description" => "The members of a WebDAV binding have already been enumerated in a previous response.",
        ],
        226 => [
            "title" => "IM Used",
            "description" => "The server has fulfilled the GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
        ],

        // Redirection
        300 => [
            "title" => "Multiple Choices",
            "description" => "There are multiple options that the client may follow.",
        ],
        301 => [
            "title" => "Moved Permanently",
            "description" => "The resource has been moved permanently to a new URI.",
        ],
        302 => [
            "title" => "Found",
            "description" => "The resource has been found temporarily at a different URI.",
        ],
        303 => [
            "title" => "See Other",
            "description" => "The response to the request can be found under another URI.",
        ],
        304 => [
            "title" => "Not Modified",
            "description" => "The resource has not been modified since the last request.",
        ],
        305 => [
            "title" => "Use Proxy",
            "description" => "The requested resource is only available through a proxy.",
        ],
        306 => [
            "title" => "Switch Proxy (Unused)",
            "description" => "This code is no longer used and is reserved for future use.",
        ],
        307 => [
            "title" => "Temporary Redirect",
            "description" => "The resource resides temporarily under a different URI.",
        ],
        308 => [
            "title" => "Permanent Redirect",
            "description" => "The resource has been permanently moved to a new URI.",
        ],

        // Client Errors
        400 => [
            "title" => "Bad Request",
            "description" => "The server cannot or will not process the request due to an apparent client error.",
        ],
        401 => [
            "title" => "Unauthorized",
            "description" => "Authentication is required and has failed or has not yet been provided.",
        ],
        402 => [
            "title" => "Payment Required",
            "description" => "This status code is reserved for future use.",
        ],
        403 => [
            "title" => "Forbidden",
            "description" => "The server understands the request but refuses to authorize it.",
        ],
        404 => [
            "title" => "Not Found",
            "description" => "The requested resource could not be found.",
        ],
        405 => [
            "title" => "Method Not Allowed",
            "description" => "The request method is not supported for the requested resource.",
        ],
        406 => [
            "title" => "Not Acceptable",
            "description" => "The requested resource is capable of generating only content not acceptable according to the Accept headers.",
        ],
        407 => [
            "title" => "Proxy Authentication Required",
            "description" => "The client must first authenticate itself with the proxy.",
        ],
        408 => [
            "title" => "Request Timeout",
            "description" => "The server timed out waiting for the request.",
        ],
        409 => [
            "title" => "Conflict",
            "description" => "The request could not be processed because of conflict in the request.",
        ],
        410 => [
            "title" => "Gone",
            "description" => "The requested resource is no longer available and will not be available again.",
        ],

        // Server Errors
        500 => [
            "title" => "Internal Server Error",
            "description" => "The server encountered an unexpected condition that prevented it from fulfilling the request.",
        ],
        501 => [
            "title" => "Not Implemented",
            "description" => "The server does not support the functionality required to fulfill the request.",
        ],
        502 => [
            "title" => "Bad Gateway",
            "description" => "The server received an invalid response from the upstream server.",
        ],
        503 => [
            "title" => "Service Unavailable",
            "description" => "The server is currently unavailable due to maintenance or overloading.",
        ],
        504 => [
            "title" => "Gateway Timeout",
            "description" => "The server did not receive a timely response from the upstream server.",
        ],
        505 => [
            "title" => "HTTP Version Not Supported",
            "description" => "The server does not support the HTTP protocol version used in the request.",
        ],
        511 => [
            "title" => "Network Authentication Required",
            "description" => "The client must authenticate to gain network access.",
        ],
    ],

    'renderable' => [401, 403, 404, 419, 429, 500, 503],

    'enable' => env('ERROR_RENDERABLE', true),
];
