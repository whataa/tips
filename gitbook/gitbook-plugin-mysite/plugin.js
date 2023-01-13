require([ 'gitbook', 'jquery'], function (gitbook) {

    const dateFormat = function(date) {      
        if(date) {   
            const obj = new Date(date)
            var strDate = obj.getFullYear()+"/"; 
            strDate += obj.getMonth()+1+"/";       
            strDate += obj.getDate();  
            return strDate ;  
        } else {
            return '';
        }
    } 
    const dot2line = function(str) {
        return str.split('.').join('_')
    }

    const bindDate2UI = function(json) {
        json.forEach(entry => {
            if($(`.chapter_${dot2line(entry.level)}`)[0]) {
                $(`.chapter_${dot2line(entry.level)}`).text(dateFormat(entry.date));
            }
        });
    }

    $('#book-search-input input').attr('placeholder', 'Search')
    // 重置font
    gitbook.storage.remove('fontState')
    gitbook.storage.set('sidebar', true)

    // 提前下载
    let cacheJson = null
    
    gitbook.events.bind('page.change', function() {        
        const chapters = $(".chapter")
        for (let index = 0; index < chapters.length; index++) {                        
            $(`<div class="chapter_${dot2line($(chapters[index]).attr('data-level'))}"></div>`).appendTo(chapters[index])
        }
        if(cacheJson) {
            bindDate2UI(cacheJson)
        }
    });
    
    gitbook.events.bind('start', function (e, config) {
        
        $.getJSON(gitbook.state.basePath + "/summary_extra.json").then(data => {
            cacheJson = data
            bindDate2UI(data)
        });

        $(".nav-btn.name").text(config.mysite.tips_name);
        
        $(".name").click(function() {
            window.location.href = config.mysite.blog_url;
        });

        $(".rss").click(function() {
            window.open(gitbook.state.basePath + '/atom.xml')
        });
        $(".github").click(function() {
            var githubURL = 'https://github.com/'+config.mysite.github;
            window.open(githubURL)
        });
        $(".drawer").click(function() {                
            gitbook.sidebar.toggle(!gitbook.storage.get('sidebar', true), true);
        });
    });
});
