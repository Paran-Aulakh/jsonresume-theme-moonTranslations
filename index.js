var fs = require('fs');
var _ = require('lodash');
var Mustache = require('mustache');

var d = new Date();
var curyear = d.getFullYear();
var language;

function getLanguage(){
  if (!language)
    language = JSON.parse(fs.readFileSync(__dirname + "/lang.se.json", "utf-8"));
  return language;
}

function getMonth(startDateStr) {

  return getLanguage().time.months[startDateStr.substr(5, 2)];

}

function render(resume) {
  var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  var tpl = fs.readFileSync(__dirname + "/resume.template", "utf-8");
  if (resume.basics && resume.basics.length > 0) {
    resume.basics = basics[0];
  }

  if (resume.basics && resume.basics.name) {
    resume.basics.capitalName = resume.basics.name.toUpperCase();
  }
  if (resume.basics && resume.basics.profiles) {
    _.each(resume.basics.profiles, function(p) {
      switch (p.network.toLowerCase()) {
        case "facebook":
          p.iconClass = "fa fa-facebook-square";
          break;
        case "github":
          p.iconClass = "fa fa-github-square";
          break;
        case "twitter":
          p.iconClass = "fa fa-twitter-square";
          break;
        case "googlePlus":
        case "google-plus":
        case "googleplus":
          p.iconClass = "fa fa-google-plus-square";
          break;
        case "youtube":
        case "YouTube":
          p.iconClass = "fa fa-youtube-square";
          break;
        case "vimeo":
          p.iconClass = "fa fa-vimeo-square";
          break;
        case "linkedin":
          p.iconClass = "fa fa-linkedin-square";
          break;
        case "pinterest":
          p.iconClass = "fa fa-pinterest-square";
          break;
        case "flickr":
        case "flicker":
          p.iconClass = "fa fa-flickr";
          break;
        case "behance":
          p.iconClass = "fa fa-behance-square";
          break;
        case "dribbble":
        case "dribble":
          p.iconClass = "fa fa-dribbble";
          break;
        case "codepen":
        case "codePen":
          p.iconClass = "fa fa-codepen";
          break;
        case "soundcloud":
        case "soundCloud":
          p.iconClass = "fa fa-soundcloud";
          break;
        case "steam":
          p.iconClass = "fa fa-steam";
          break;
        case "reddit":
          p.iconClass = "fa fa-reddit";
          break;
        case "tumblr":
        case "tumbler":
          p.iconClass = "fa fa-tumblr-square";
          break;
        case "stack-overflow":
        case "stackOverflow":
          p.iconClass = "fa fa-stack-overflow";
          break;
        case "bitbucket":
          p.iconClass = "fa fa-bitbucket";
          break;
        case "blog":
        case "rss":
          p.iconClass = "fa fa-rss-square";
          break;
      }

      if (p.url) {
        p.text = p.url;
      } else {
        p.text = p.network + ": " + p.username;
      }
    });
  }

  if (resume.work && resume.work.length) {
    resume.workBool = true;

    _.each(resume.work, function(w) {
      if (w.startDate) {
        w.startDateYear = (w.startDate || "").substr(0, 4);
        w.startDateMonth = getMonth(w.startDate || "");

      }
      if (w.endDate) {
        w.endDateYear = (w.endDate || "").substr(0, 4);
        w.endDateMonth = getMonth(w.endDate || "");
      } else {
        var lan = getLanguage();
        w.endDateYear = lan.time.present;//'Present';
      }
      if (w.highlights) {
        if (w.highlights[0]) {
          if (w.highlights[0] !== "") {
            w.boolHighlights = true;
          }
        }
      }
    });
  }

  if (resume.volunteer && resume.volunteer.length) {
    resume.volunteerBool = true;
    _.each(resume.volunteer, function(w) {
      if (w.startDate) {
        w.startDateYear = (w.startDate || "").substr(0, 4);
        w.startDateMonth = getMonth(w.startDate || "");

      }
      if (w.endDate) {
        w.endDateYear = (w.endDate || "").substr(0, 4);
        w.endDateMonth = getMonth(w.endDate || "");
      } else {
        var lan = getLanguage();
        w.endDateYear = lan.time.present;
      }
      if (w.highlights) {
        if (w.highlights[0]) {
          if (w.highlights[0] !== "") {
            w.boolHighlights = true;
          }
        }
      }
    });
  }

  if (resume.photo) {
    resume.photoBool = true;
  }

  if (resume.education && resume.education.length) {
    if (resume.education[0].institution) {
      resume.educationBool = true;
      _.each(resume.education, function(e) {
        if (!e.area || !e.studyType) {
          e.educationDetail = (e.area === null ? '' : e.area) + (e.studyType === null ? '' : e.studyType);
        } else {
          e.educationDetail = e.area + ", " + e.studyType;
        }
        if (e.startDate) {
          e.startDateYear = e.startDate.substr(0, 4);
          e.startDateMonth = getMonth(e.startDate || "");
        } else {
          e.endDateMonth = "";
        }
        if (e.endDate) {
          e.endDateYear = e.endDate.substr(0, 4);
          e.endDateMonth = getMonth(e.endDate || "");

          if (e.endDateYear > curyear) {
            e.endDateYear += " (expected)";
          }
        } else {
          var lan = getLanguage();
          e.endDateYear = lan.time.present;//'Present';
          e.endDateMonth = '';
        }
        if (e.courses) {
          if (e.courses[0]) {
            if (e.courses[0] !== "") {
              e.educationCourses = true;
            }
          }
        }
      });
    }
  }

  if (resume.awards && resume.awards.length) {
    if (resume.awards[0].title) {
      resume.awardsBool = true;
      _.each(resume.awards, function(a) {
        a.year = (a.date || "").substr(0, 4);
        a.day = (a.date || "").substr(8, 2);
        a.month = getMonth(a.date || "");
      });
    }
  }

  if (resume.publications && resume.publications.length) {
    if (resume.publications[0].name) {
      resume.publicationsBool = true;
      _.each(resume.publications, function(a) {
        a.year = (a.releaseDate || "").substr(0, 4);
        a.day = (a.releaseDate || "").substr(8, 2);
        a.month = getMonth(a.releaseDate || "");
      });
    }
  }

  if (resume.skills && resume.skills.length) {
    if (resume.skills[0].name) {
      resume.skillsBool = true;
    }
  }

  if (resume.interests && resume.interests.length) {
    if (resume.interests[0].name) {
      resume.interestsBool = true;
    }
  }

  if (resume.languages && resume.languages.length) {
    if (resume.languages[0].language) {
      resume.languagesBool = true;
    }
  }

  if (resume.references && resume.references.length) {
    if (resume.references[0].name) {
      resume.referencesBool = true;
    }
  }

  resume.language = getLanguage();

  console.log(resume.language.basics);

  resume.css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  resume.printcss = fs.readFileSync(__dirname + "/print.css", "utf-8");
  var theme = fs.readFileSync(__dirname + '/resume.template', 'utf8');

  resume.inYears = (function(_firstJobStartDateStr) {
    var firstJobStartDate = new Date(_firstJobStartDateStr);
    return function() {
      return (new Date()).getFullYear() - firstJobStartDate.getFullYear();
    };
  })(resume.work[resume.work.length - 1].startDate);
  var resumeHTML = Mustache.render(theme, resume);


  return resumeHTML;
}
module.exports = {
  render: render
};
