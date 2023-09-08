/*
 * preproc/whitespace.rs
 *
 * ftml - Library to parse Wikidot text
 * Copyright (C) 2019-2023 Wikijump Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

//! This performs the various miscellaneous substitutions that Wikidot does
//! in preparation for its parsing and handling processes. These are:
//! * Replacing DOS and legacy Mac newlines
//! * Trimming whitespace lines
//! * Concatenating lines that end with backslashes
//! * Convert tabs to four spaces
//! * Convert null characters to regular spaces
//! * Compress groups of 3+ newlines into 2 newlines

use once_cell::sync::Lazy;
use regex::{Regex, RegexBuilder};

static LEADING_NONSTANDARD_WHITESPACE: Lazy<Regex> = Lazy::new(|| {
    RegexBuilder::new("^[\u{00a0}\u{2007}]+")
        .multi_line(true)
        .build()
        .unwrap()
});
static WHITESPACE_ONLY_LINE: Lazy<Regex> = Lazy::new(|| {
    RegexBuilder::new(r"^\s+$")
        .multi_line(true)
        .build()
        .unwrap()
});
static LEADING_NEWLINES: Lazy<Regex> = Lazy::new(|| Regex::new(r"^\n+").unwrap());
static TRAILING_NEWLINES: Lazy<Regex> = Lazy::new(|| Regex::new(r"\n+$").unwrap());

pub fn substitute(text: &mut String) {
    // Replace DOS and Mac newlines
    str_replace(text, "\r\n", "\n");
    str_replace(text, "\r", "\n");

    // Replace leading non-standard spaces with regular spaces
    // Leave other non-standard spaces as-is (such as nbsp in
    // the middle of paragraphs)
    replace_leading_spaces(text);

    // Strip lines with only whitespace
    regex_replace(text, &WHITESPACE_ONLY_LINE, "");

    // Join concatenated lines (ending with '\')
    str_replace(text, "\\\n", "");

    // Tabs to spaces
    str_replace(text, "\t", "    ");

    // Null characters to spaces
    str_replace(text, "\0", " ");

    // Remove leading and trailing newlines,
    // save one at the end
    regex_replace(text, &LEADING_NEWLINES, "");
    regex_replace(text, &TRAILING_NEWLINES, "");
}

fn str_replace(text: &mut String, pattern: &str, replacement: &str) {
    debug!(
        "Replacing miscellaneous static string (pattern {}, replacement {})",
        pattern, replacement,
    );

    while let Some(idx) = text.find(pattern) {
        let range = idx..idx + pattern.len();
        text.replace_range(range, replacement);
    }
}

fn regex_replace(text: &mut String, regex: &Regex, replacement: &str) {
    debug!(
        "Replacing miscellaneous regular expression (pattern {}, replacement {})",
        regex.as_str(),
        replacement,
    );

    while let Some(mtch) = regex.find(text) {
        let range = mtch.start()..mtch.end();
        text.replace_range(range, replacement);
    }
}

fn replace_leading_spaces(text: &mut String) {
    debug!("Replacing leading non-standard spaces with regular spaces");

    if let Some(mtch) = LEADING_NONSTANDARD_WHITESPACE.find(text) {
        let range = mtch.start()..mtch.end();
        let count = mtch.as_str().chars().count();
        let spaces = " ".repeat(count);
        text.replace_range(range, &spaces);
    }
}

#[cfg(test)]
const TEST_CASES: [(&str, &str); 7] = [
    (
        "\tapple\n\tbanana\tcherry\n",
        "    apple\n    banana    cherry",
    ),
    (
        "newlines:\r\n* apple\r* banana\r\ncherry\n\r* durian",
        "newlines:\n* apple\n* banana\ncherry\n\n* durian",
    ),
    (
        "apple\nbanana\n\ncherry\n\n\npineapple\n\n\n\nstrawberry\n\n\n\n\nblueberry\n\n\n\n\n\n",
        "apple\nbanana\n\ncherry\n\npineapple\n\nstrawberry\n\nblueberry",
    ),
    (
        "apple\rbanana\r\rcherry\r\r\rpineapple\r\r\r\rstrawberry\r\r\r\r\rblueberry\r\r\r\r\r\r",
        "apple\nbanana\n\ncherry\n\npineapple\n\nstrawberry\n\nblueberry",
    ),
    (
        "concat:\napple banana \\\nCherry\\\nPineapple \\ grape\nblueberry\n",
        "concat:\napple banana CherryPineapple \\ grape\nblueberry",
    ),
    ("<\n        \n      \n  \n      \n>", "<\n\n>"),
    (
        "\u{00a0}\u{00a0}\u{2007} apple", "    apple",
    ),
];

#[test]
fn regexes() {
    let _ = &*LEADING_NONSTANDARD_WHITESPACE;
    let _ = &*WHITESPACE_ONLY_LINE;
    let _ = &*LEADING_NEWLINES;
    let _ = &*TRAILING_NEWLINES;
}

#[test]
fn test_substitute() {
    use super::test::test_substitution;

    test_substitution("miscellaneous", substitute, &TEST_CASES);
}
