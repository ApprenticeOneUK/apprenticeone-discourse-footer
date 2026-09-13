import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const migration=readFileSync('migrations/settings/0005-three-column-footer.js','utf8');
const {default:migrate}=await import('data:text/javascript;base64,'+Buffer.from(migration).toString('base64'));
test('moves community and policy links without changing destinations or translations',()=>{
  const links=[{text:'Contact us',url:'/synthetic-contact',target:'_self',translations:[{locale:'fr',text:'Contact'}]}];
  const small=[{text:'About',url:'/about'},{text:'Privacy Policy',url:'/privacy'},{text:'Cookie Policy',url:'/pub/cookie-policy'}];
  const settings=new Map([['sections',[{text:'Community',links,translations:[{locale:'fr',text:'Communauté'}]}]],['small_links',small]]);
  migrate(settings);assert.deepEqual(settings.get('community_links'),links);
  assert.deepEqual(settings.get('policy_links'),small.slice(1));
  assert.equal(settings.get('community_heading_translations')[0].text,'Communauté');
  assert.equal(settings.get('small_links'),small);
  const first=JSON.stringify([...settings]);migrate(settings);assert.equal(JSON.stringify([...settings]),first);
});
test('preserves deliberately empty lists and already configured new values',()=>{
  const settings=new Map([['community_links',[]],['policy_links',[]],['sections',[{text:'Community',links:[{text:'Old',url:'/old'}]}]],['small_links',[{text:'Old',url:'/old'}]]]);
  migrate(settings);assert.deepEqual(settings.get('community_links'),[]);assert.deepEqual(settings.get('policy_links'),[]);
});
test('recognises explicit Policy section and does not use old small links over it',()=>{
  const settings=new Map([['sections',[{text:'Policy',links:[{text:'Custom',url:'/policy'}]}]],['small_links',[{text:'Old',url:'/old'}]]]);
  migrate(settings);assert.equal(settings.get('policy_links')[0].url,'/policy');
});
test('excludes About by destination, including translated label and absolute URL',()=>{
  const settings=new Map([['small_links',[{text:'À propos',url:'https://example.test/about?tab=site'},{text:'Privacy',url:'/privacy'}]]]);
  migrate(settings);assert.equal(settings.get('policy_links').length,1);
});
test('missing old settings allow schema defaults instead of manufacturing empty values',()=>{
  const settings=new Map();migrate(settings);assert.equal(settings.size,0);
});
test('localized section preserves order and resolves relative site URLs',()=>{
  const source=readFileSync('javascripts/discourse/components/footer-link-section.gjs','utf8');
  const code=source.split('  <template>')[0].replace(/^import .*;\r?\n/gm,'').replace('export default class FooterLinkSection','class Section')+'}\nSection;';
  const Section=vm.runInNewContext(code,{Component:class{constructor(args){this.args=args;}},getURL:url=>'/forum'+url,I18nInstance:{currentLocale:()=> 'fr'}});
  const section=new Section({heading:'Community',translations:[{locale:'fr',text:'Communauté'}],links:[{text:'Browse',url:'/latest',translations:[{locale:'fr',text:'Explorer'}]},{text:'External',url:'https://example.test'}]});
  assert.equal(section.heading,'Communauté');assert.equal(section.links[0].text,'Explorer');
  assert.equal(section.links[0].url,'/forum/latest');assert.equal(section.links[1].url,'https://example.test');assert.equal(section.links[0].target,'_self');
});
test('resource outlet occurs in actual document order between manual sections',()=>{
  const source=readFileSync('javascripts/discourse/components/custom-footer.gjs','utf8');
  assert.ok(source.indexOf('@sectionKey="community"')<source.indexOf('@name="apprenticeone-footer-resources"'));
  assert.ok(source.indexOf('@name="apprenticeone-footer-resources"')<source.indexOf('@sectionKey="policy"'));
  assert.doesNotMatch(source,/first-box|third-box|settings\.small_links|settings\.blurb|settings\.social_links/);
  assert.match(source,/\{\{#if @showFooter\}\}/);
});
