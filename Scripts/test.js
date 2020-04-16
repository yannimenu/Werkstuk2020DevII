
function documentInit() {
    $(function () {
        console.log("ready!");

        db = DataBase.init();

        db.collection("testCollection").get().then(res => {
            res.forEach(element => {
                console.log("res id:", element.id);
                console.log("res data:", element.data());
            });
        }
        ).catch(function (error) {
            console.log("Error getting documents: ", error);
        });


        $('#submitForm').on('submit', function (event) {
            event.preventDefault();
            var val = +($(this).find('[name=number]').val());

            console.log(val);
            //
            db.collection("testCollection").doc().set({
                test: val,
                madewith: 'javascript'
            })
                .then(function (cb) {
                    console.log("Document successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            //

        });
    });
}
