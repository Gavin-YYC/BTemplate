module.exports = [
    "<p>{{title}}</p>",
    "{{ if isAdmin}}",
        "<ul>",
            "{{each list as item index}}",
                "<li>索引：{{item}} - {{index}}</li>",
            "{{/each}}",
        "</ul>",
    "{{/if}}"
].join('');
