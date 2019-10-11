# Release planning

## v3.1.0
*(next)*
- [ ] add: Received payments
- [ ] add: Payed VAT (taxes)
- [ ] add: Payed VAT to recipients
- [ ] update: Choose fields of generated .xls

## v3.0.0
*(WIP)*
- [ ] BREAKING CHANGE: Complete rewrite of the application with current functionality

## v2.3.0
*planned functionality moved to v3.0.0 branch*

## v2.2.1
Bugfixes:

- [x] add: RELEASES.md file with planned functioniality
- [x] add: Invoice edit - add field for invoice price with VAT
- [x] fix: When updating invoice, choosing presaved provider does not trigger `form.dirty`
- [x] fix: Sending via email was not working
- [x] fix: Correct app resources - icons and so on...
- [x] fix: Sticky headers in tables has gap over them
- [x] fix: Invoices list - Checkbox "Select/Deselect all" ignores filters
- [ ] fix: After sending invoices button "Send selected" remains active
- [x] update: Generated .xls must have only basic invoice info
- [x] fix: DB overflow when creating invoices - invoices are stored with recipient's invoices
- [x] fix: Replace `electron/environment.js` with dev version after building (ElAn bug)

Optional:
- [ ] add: Save last state option

## v2.2.0
- [x] BREAKING CHANGE: App is re-initialized with [ElAn cli](https://github.com/D-LUSiON/elan-cli)
