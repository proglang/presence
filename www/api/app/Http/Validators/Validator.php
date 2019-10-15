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
        if ($name == "lower") {
            return "a-z";
        }
        if ($name == "upper") {
            return "A-Z";
        }
        if ($name == "special") {
            return config('validation.password.specialchar');
        }
        if ($name == "digit") {
            return "0-9";
        }
        return "";
    }
    private function toRegex($r)
    {
        if ($r == "") return "";
        return  "/[$r]/";
    }
    public function validateHasLower($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->toRegex($this->getRegex('lower')), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasUpper($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->toRegex($this->getRegex('upper')), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasDigit($attribute, $value, $parameters)
    {
        $count = $this->getParam($parameters, 0, 1);
        $ret = preg_match_all($this->toRegex($this->getRegex('digit')), $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateHasSpecial($attribute, $value, $parameters)
    {
        if ($this->getRegex('special') == "") return true;
        $count = $this->getParam($parameters, 0, 1);
        $special = $this->toRegex($this->getParam($parameters, 1, $this->getRegex('special')));
        $ret = preg_match_all($special, $value);
        if (!$ret) return false;
        return $ret >= $count;
    }
    protected function validateNoForbidden($attribute, $value, $parameters)
    {
        $count = strlen($value);
        foreach ($parameters as  $name) {
            $regex = $this->getRegex($name);
            if ($regex == "") continue;
            $ret = preg_match_all($this->toRegex($regex), $value);
            $count = $count - ($ret ? $ret : 0);
        }
        return $count == 0;
    }
    public function validateUnique($attribute, $value, $parameters)
    {
        $encryption = $parameters[2] ?? null;
        if ($encryption != null && $encryption != "NULL") {
            $value = hash($encryption, $value);
        }
        return parent::validateUnique($attribute, $value, $parameters);
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
        $message = str_replace(':min', $this->getParam($parameters, 0, 1), $message);
        return str_replace(':regex', $this->getParam($parameters, 1, $this->getRegex('special')), $message);
    }
    protected function replaceHasDigit($message, $attribute, $rule, $parameters)
    {
        return str_replace(':min', $this->getParam($parameters, 0, 1), $message);
    }
}
trait ValidationReplaceRules
{
    //protected static $replaceRules = [
    //    'password' => self::ReplacePW,//['hasUpper:2|hasSpecial:1,@$!%*#?&|hasDigit:2],
    //];
    private static function ReplaceRulePassword()
    {
        $rule = 'string|required|max:255|noForbidden:lower,upper,special,digit';

        $pw_length = config('validation.password.length');
        $lc_count = config('validation.password.lowercase');
        $uc_count = config('validation.password.uppercase');
        $d_count = config('validation.password.digit');
        $sc_count = config('validation.password.special');
        $schars = config('validation.password.specialchar');
        $sc_count = $schars == "" ? 0 : $sc_count;

        if ($pw_length > 0) {
            $rule = $rule . "|min:" . $pw_length;
        }
        if ($lc_count > 0) {
            $rule = $rule . "|hasLower:" . $lc_count;
        }
        if ($uc_count > 0) {
            $rule = $rule . "|hasUpper:" . $uc_count;
        }
        if ($d_count > 0) {
            $rule = $rule . "|hasDigit:" . $d_count;
        }
        if ($sc_count > 0) {
            $rule = $rule . "|hasSpecial:" . $sc_count . "," . $schars;
        }

        return [$rule];
    }
    private static function ReplaceRule($rule)
    {
        $cl = [get_called_class(), 'ReplaceRule' . $rule];
        if (!method_exists($cl[0], $cl[1]) || !is_callable($cl)) {
            return [$rule];
        }
        $ruleval = call_user_func_array($cl, []);
        $rules = [];
        foreach ($ruleval as $value) {
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
        'has_special' => "The :attribute must contain at least :min special characters (:regex)",
        'no_forbidden' => "The :attribute contains forbidden characters!",
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
