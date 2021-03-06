jQuery(function($){
    
    var needRefresh = false;
    
    /**
    * Check a response fromt he server to see if the call was successful (uses
    *  success flag, not HTTP error codes)
    */
    function isSuccessful(raw_json)
    {
        o = eval('(' + raw_json + ')');
        return o.success == true;
    }

    /**
    * Show and fade away a 'saved' message next to a checkbox with the given id
    */
    function markSaved(span_id)
    {
        jQuery(span_id).show().delay(500).fadeOut();
    }

    $('#zip_code_add').click(function() {
        var zip_code = $('#zip_code').val();

        // Validate ZIP code format
        var re = new RegExp(/^[0-9]{5}$/);
        if (!re.test(zip_code)) {
            alert("ZIP code must be 5 digits");
            $('#zip_code').select();
            return;
        }

        // Make sure it's not already on the list
        if ($("#zip_codes option[value='" + zip_code + "']").length > 0) {
            alert("ZIP code is already entered");
            $('#zip_code').select();
            return;
        }

        // Append to list of ZIP codes
        $('#zip_codes')
            .append($("<option></option>")
            .attr("value",zip_code)
            .text(zip_code));

        // Clear ZIP code field, put focus on it
        $('#zip_code').val('').focus();
    });

    $('#zip_code_remove').click(function() {
        $("#zip_codes option:selected").remove();
    });

    $('#category_add').click(function() {
        var category = $('#category').val();

        // Validate non-blank value
        if (category.length == 0) {
            alert("Category must be entered");
            $('#category').select();
            return;
        }

        // Make sure it's not already on the list
        if ($("#categories option[value='" + category + "']").length > 0) {
            alert("Category is already entered");
            $('#category').select();
            return;
        }

        // Append to list of categories
        $('#categories')
            .append($("<option></option>")
            .attr("value",category)
            .text(category));

        // Clear ZIP code field, put focus on it
        $('#category').val('').focus();
    });

    $('#category_remove').click(function() {
        $("#categories option:selected").remove();
    });

    $('#use_cuisine_types').click(function() {
        if ($('#use_cuisine_types').is(':checked'))
            $('#custom-categories').hide();
        else
            $('#custom-categories').show();
    });
    
    $('#save-bizyhood').click(function() {
        
        var network_id = $('#network').val();

        // Mark all ZIPs and categories in <select> as selected
        $('select#zip_codes option').prop('selected', true);
        $('select#categories option').prop('selected', true);

        // Submit AJAX request
        jQuery.post(ajaxurl, {
             action: 'save_settings', 
             api_url: $('#api_url').val(),
             main_page_id: $('#main_page_id').val(),
             signup_page_id: $('#signup_page_id').val(),
             zip_codes: $('#zip_codes').val(),
             use_cuisine_types: $('#use_cuisine_types').is(':checked'),
             categories: $('#categories').val()
            }, 
            function(response) {
                if(response.success) {
                    markSaved('#save-success');
                }
            },
        'json');

        // Unselect all ZIPs and categories
        $('select#zip_codes option').prop('selected', false);
        $('select#categories option').prop('selected', false);
    });
    
});