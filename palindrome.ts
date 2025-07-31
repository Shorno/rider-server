const isPalindrome = (input: string) => {
    if (input === "") return true;

    if (input[0] !== input[input.length - 1]) return false;

    return isPalindrome(input.slice(1, -1))
}


// Palindrome test cases
console.log(isPalindrome("")); // true (empty string)
console.log(isPalindrome("a")); // true (single character)
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("abba")); // true
console.log(isPalindrome("abcba")); // true


console.log("Non")
// Non-palindrome test cases
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("abc")); // false
console.log(isPalindrome("palindrome")); // false
console.log(isPalindrome("ab")); // false