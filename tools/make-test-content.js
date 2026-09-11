// Regenerates data/test-every-shape/content.js from data/sfl1/content.js. Run from the build folder: node tools/make-test-content.js (for developers; not needed for content editing).
const fs=require('fs'); global.window={};
eval(fs.readFileSync('data/sfl1/content.js','utf8'));
const c=JSON.parse(JSON.stringify(window.SFL_CONTENT));
c.title="Every Shape Test";
c.time_limit_minutes=2;
c.results_mode="demo";
Object.assign(c.rules,{support_order:"any",confirm_before_support:false,show_support_outcomes:false,ask_reason_for_unmoved:true,notes_in_reflect:true,notes_include_onboarding:false,can_skip_explore_points:false,occupied_station:"swap"});
c.onboarding.questions=c.onboarding.questions.slice(0,3).map((q,i)=>Object.assign(q,{recommended_position:i+1}));
const [d1,d2,d3]=c.days;
// Day A: 2 people, 2 stations, no explore phase, 2-option support
const a=JSON.parse(JSON.stringify(d1)); a.id="dA"; a.name="Day 1"; a.phases=["assign","support","reflect"]; delete a.explore_points;
a.people=a.people.filter(p=>["maya","tom"].includes(p.id)); a.stations=a.stations.filter(s=>["soil","water"].includes(s.id));
a.start_assignment={maya:"water",tom:"soil"};
a.support=a.support.filter(s=>["d1-tom","d1-maya"].includes(s.id)); a.support[0].options=a.support[0].options.slice(0,2);
a.reflect=a.reflect.filter(r=>["d1-r-tom","d1-r-maya"].includes(r.person?("d1-r-"+r.person):"")) ;
a.stations[0].x=40; a.stations[0].y=35;
// Day B: 3 people, 3 stations, explore 1, only explore + reflect with custom options
const b=JSON.parse(JSON.stringify(d2)); b.id="dB"; b.name="Day 2"; b.phases=["explore","reflect"]; b.explore_points=1;
b.people=b.people.filter(p=>["maya","daniel","priya"].includes(p.id)); b.stations=b.stations.filter(s=>["nursery","wildlife","data"].includes(s.id));
b.start_assignment={maya:"nursery",daniel:"wildlife",priya:"data"};
b.support=[]; b.reflect=[{id:"b-r1",person:"daniel",prompt:"How sure is Daniel about the survey?",options:[{id:"sure",label:"Sure"},{id:"unsure",label:"Unsure"},{id:"idk",label:"I don't know"}],truth:"sure",why:"Test item."},{id:"b-r2",prompt:"How did the project go overall?",unknowable:true,why:"Test item with no person."}];
// Day C: 5 people, 5 stations
const cc=JSON.parse(JSON.stringify(d3)); cc.id="dC"; cc.name="Day 3"; cc.explore_points=4;
cc.people.push({id:"ana",name:"Ana Lopes",role:"Data analyst",description:"Keeps the project's numbers in order.",good_stations:["store"],placement_why:"Test person.",answers:{want:{text:"Numbers.",useful:false,why:"t"},strengths:{text:"Spreadsheets.",useful:false,why:"t"},weaknesses:{text:"Boats.",useful:false,why:"t"}}});
cc.stations.push({id:"store",name:"Records Office",icon:"chart",description:"Stores records.",answers:{task:{text:"File things.",useful:false,why:"t"},skills:{text:"Tidiness.",useful:false,why:"t"}}});
cc.start_assignment.ana="store";
// Day D: copy of day 1 renamed (4 days total)
const dd=JSON.parse(JSON.stringify(d1)); dd.id="dD"; dd.name="Day 4";
c.days=[a,b,cc,dd];
fs.writeFileSync('data/test-every-shape/content.js',
`/* TEST CONTENT — not for customers. Uses every shape the content format allows:
   4 days; 2, 3, 5 and 4 people/stations; a day without Explore; a day with only
   Explore and Reflect; 3 onboarding questions; 2-option Support; a Reflect question
   with no person and 3 custom options; station coordinates; every rule switched
   the other way; demo results; a 2-minute clock. Open with index.html?content=test-every-shape
   Regenerate it rather than editing by hand. */
window.SFL_CONTENT = ` + JSON.stringify(c,null,1) + ';\n');
