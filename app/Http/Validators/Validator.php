<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use  Illuminate\Validation\Validator as BaseValidator;

trait ValidationFn
{
    private function getRegex($name)
    {
        $regex = [
            'lower' => "/[a-z]/",
            'upper' => "/[A-Z]/",
            'special' => "/[@$!%*#?&]/",
            'digit' => "/[0-9]/"
        ];
        if (!isset($regex[$name])) return "";
        return $regex[$name];
    }
    public function validateHasLower($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->getRegex('lower'), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasUpper($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->getRegex('upper'), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasDigit($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->getRegex('digit'), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasSpecial($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->getRegex('special'), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateNoForbidden($attribute, $value, $parameters)
    {
        $count = strlen($value);
        foreach ($parameters as  $name) {
            $ret = preg_match_all($this->getRegex($name), $value);
            $count = $count - ($ret ? $ret : 0);
        }
        return $count==0;
    }
}
trait ValidationRepl
{
    protected function replaceHasLower($message, $attribute, $rule, $parameters)
    {
        return str_replace(':min', $this->getParam($parameters, 0, 1), $message);
    }
    protected function replaceHasUpper($message, $attribute, $rule, $parameters)
    {
        return str_replace(':min', $this->getParam($parameters, 0, 1), $message);
    }
    protected function replaceHasSpecial($message, $attribute, $rule, $parameters)
    {
        return str_replace(':min', $this->getParam($parameters, 0, 1), $message);
    }
    protected function replaceHasDigit($message, $attribute, $rule, $parameters)
    {
        return str_replace(':min', $this->getParam($parameters, 0, 1), $message);
    }
}
trait ValidationReplaceRules
{
    protected static $replaceRules = [
        'password' => ['string|hasLower:2|hasUpper:2|hasSpecial:1|hasDigit:2|required|min:10|max:255|noForbidden:lower,upper,special,digit'],
    ];
    private static function ReplaceRule($rule)
    {
        if (!isset(self::$replaceRules[$rule])) {
            return [$rule];
        }
        $rules = [];
        foreach (self::$replaceRules[$rule] as $value) {
            if (is_string($value)) {
                $rules = array_merge($rules, explode("|", $value));
            } else {
                $rules[] = $value;
            }
        }
        return $rules;
    }
}

class Validator extends BaseValidator
{
    use ValidationFn;
    use ValidationRepl;
    use ValidationReplaceRules;
    private const my_messages = [
        'has_lower' => "The :attribute must contain at least :min lower characters",
        'has_upper' => "The :attribute must contain at least :min upper characters",
        'has_digit' => "The :attribute must contain at least :min digits",
        'has_special' => "The :attribute must contain at least :min special characters (@$!%*#?&)",
        'no_forbidden'=> "The :attribute contains forbidden characters!",
    ];
    private function getParam($attr, $index, $default)
    {
        if (!isset($attr[$index])) return $default;
        return $attr[$index];
    }
    public function __construct(
        \Illuminate\Contracts\Translation\Translator $translator,
        array $data,
        array $rules,
        array $messages = [],
        array $customAttributes = []
    ) {
        parent::__construct($translator, $data, $rules, $messages, $customAttributes);
        $this->customMessages = array_merge(self::my_messages, $this->customMessages);
        $newrules = [];
        foreach ($this->rules as $key => $rules) {
            $newrules[$key] = [];
            foreach ($rules as $rule) {
                if (is_string($rule)) {
                    $newrules[$key] = array_merge($newrules[$key], self::ReplaceRule($rule));
                } else {
                    $newrules[$key][] = $rule;
                }
            }
        }
        $this->rules = $newrules;
        $this->setPresenceVerifier(app()['validation.presence']);
    }
}
