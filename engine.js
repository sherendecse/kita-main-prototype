const ASSESSMENT='2026-10-23';
const states=['Johor','Kedah','Kelantan','Kuala Lumpur','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Putrajaya','Selangor','Terengganu'];
const seed=[
['Aina Demo','hospital_klinik','Demo Clinic A',true,'2024-05-12',3200,'Selangor',true,false,false,false,false],
['Daniel Demo','ketua_penduduk',null,true,'2025-11-01',4500,'Kuala Lumpur',false,false,false,true,false],
['Kavitha Demo','family',null,true,'2023-10-23',5000,'Johor',false,true,false,false,false],
['Farid Demo','social_media',null,true,'2026-09-15',2800,'Perak',false,false,true,false,false],
['Mei Demo','hospital_klinik','Demo Clinic B',true,'2022-10-23',3000,'Selangor',true,false,false,true,false],
['Hakim Demo','social_media',null,true,'2024-01-20',5001,'Kuala Lumpur',false,false,false,true,false],
['Sara Demo','family',null,true,'2025-03-08',2200,'Sabah',true,false,false,false,false],
['Alex Demo','ketua_penduduk',null,false,'2024-08-17',2600,'Selangor',false,false,false,false,false],
['Priya Demo','hospital_klinik','Demo Clinic C',true,'2025-07-10',null,'Negeri Sembilan',true,false,false,false,false],
['Amir Demo','social_media',null,true,'2024-12-05',3500,'Melaka',true,false,false,false,true]
].map((v,i)=>Object.fromEntries([['application_id','KM'+String(i+1).padStart(3,'0')],['household_id','DEMO-H'+String(i+1).padStart(3,'0')],...['full_name','referral_source','hospital_clinic_name','malaysian_citizen_family','child_date_of_birth','monthly_household_income_rm','state','str_registered','ekasih_registered','mysalam_eligible','ppr_resident','already_enrolled'].map((k,j)=>[k,v[j]])]));
function age(d){if(!d)return 'Missing';const a=new Date(d+'T00:00:00Z');if(!Number.isFinite(+a)||a.toISOString().slice(0,10)!==d)return 'Invalid date';let m=(2026-a.getUTCFullYear())*12+9-a.getUTCMonth();if(23<a.getUTCDate())m--;if(m<0)return 'Not yet born';return `${Math.floor(m/12)}y ${m%12}m`;}
function duplicates(a,all){const norm=v=>String(v??'').trim().toLowerCase();const phone=v=>String(v??'').replace(/\D/g,'').replace(/^0060/,'60').replace(/^0/,'60');return all.filter(x=>x!==a&&x.application_id!==a.application_id&&((norm(a.household_id)&&norm(x.household_id)===norm(a.household_id))||(phone(a.phone_number)&&phone(x.phone_number)===phone(a.phone_number))));}
function evaluate(a,all=seed){const checks=[];const add=(label,status,reason)=>checks.push({label,status,reason});
add('Malaysian citizenship',a.malaysian_citizen_family===true?'pass':a.malaysian_citizen_family===false?'fail':'review',a.malaysian_citizen_family===true?'Malaysian citizen family confirmed.':a.malaysian_citizen_family===false?'Family is not Malaysian citizens.':'Citizenship information is missing.');
add('Peninsular residence',!a.state?'review':states.includes(a.state)?'pass':['Sabah','Sarawak','Labuan'].includes(a.state)?'fail':'review',!a.state?'State is missing.':states.includes(a.state)?`${a.state} is in Peninsular Malaysia.`:['Sabah','Sarawak','Labuan'].includes(a.state)?`${a.state} is outside Peninsular Malaysia.`:'State is unrecognized; confirm residence.');
const d=a.child_date_of_birth;const valid=d&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!['Invalid date','Missing'].includes(age(d));const eligible=valid&&d>'2022-10-23'&&d<=ASSESSMENT;
add('Child aged 0–3',!valid?'review':eligible?'pass':'fail',!valid?'Child date of birth is missing or invalid.':eligible?`Born ${d} · ${age(d)} on assessment date.`:d>ASSESSMENT?'Date of birth is after the assessment date.':`Born ${d} · has reached their fourth birthday.`);
const income=a.monthly_household_income_rm;const iv=typeof income==='number'&&Number.isFinite(income)&&income>=0;add('Household income ≤ RM5,000',!iv?'review':income<=5000?'pass':'fail',!iv?'Monthly household income is missing or invalid.':`RM${income.toLocaleString('en-MY')} per month ${income<=5000?'meets':'exceeds'} the RM5,000 limit.`);
const b=[a.str_registered,a.ekasih_registered,a.mysalam_eligible,a.ppr_resident];const any=b.some(x=>x===true);const known=b.every(x=>typeof x==='boolean');add('Benefit status or PPR',any?'pass':known?'fail':'review',any?['STR','eKasih','mySalam','PPR housing'].filter((_,i)=>b[i]===true).join(', ')+' confirmed (simulated).':known?'No STR, eKasih, mySalam or PPR status confirmed.':'Benefit/PPR information is incomplete; no positive status confirmed.');
const duplicate=duplicates(a,all).length>0;add('One allocation per household',!a.household_id||typeof a.already_enrolled!=='boolean'||a.already_enrolled||duplicate?'review':'pass',!a.household_id?'Household ID is missing.':a.already_enrolled?'Household is already enrolled; staff must review before any allocation.':duplicate?'Matching household ID or phone number found in another application; staff must review.':typeof a.already_enrolled!=='boolean'?'Enrollment status is missing.':'No existing enrollment or duplicate household found.');
return {status:checks.some(c=>c.status==='fail')?'Not qualified':checks.some(c=>c.status==='review')?'Needs review':'Qualified',checks};}
if(typeof module!=='undefined')module.exports={seed,evaluate,age,duplicates};
